import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { GetCollegesDto } from './dto/get-colleges.dto.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class CollegesService {
  constructor(private readonly prisma: PrismaService) {}

  // Feature 1: College Listing + Search + Filtering + Pagination
  async findAll(query: GetCollegesDto) {
    const { search, city, state, maxFee, minRating, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.CollegeWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (city) where.city = { equals: city, mode: 'insensitive' };
    if (state) where.state = { equals: state, mode: 'insensitive' };
    if (minRating) where.avgRating = { gte: minRating };

    if (maxFee) {
      where.courses = {
        some: { tuitionFee: { lte: maxFee } },
      };
    }

    const [colleges, total] = await Promise.all([
      this.prisma.college.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nirfRank: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          state: true,
          logo: true,
          avgRating: true,
          totalReviews: true,
          courses: {
            select: { id: true, title: true, tuitionFee: true },
            take: 3,
          },
        },
      }),
      this.prisma.college.count({ where }),
    ]);

    return {
      data: colleges.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        location: `${c.city}, ${c.state}`,
        rating: c.avgRating,
        reviewsCount: c.totalReviews,
        minFee: c.courses.length ? Math.min(...c.courses.map((cr) => cr.tuitionFee)) : null,
        courses: c.courses,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  // Feature 2: College Detail Page
  async findBySlug(slug: string) {
    const college = await this.prisma.college.findUnique({
      where: { slug },
      include: {
        courses: {
          include: { cutoffs: { orderBy: { year: 'desc' }, take: 5 } },
        },
        placements: { orderBy: { year: 'desc' } },
        reviews: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!college) {
      throw new NotFoundException(`College with slug '${slug}' not found`);
    }

    return college;
  }

  // Feature 3: Side-by-Side Comparison
  async compareColleges(collegeIds: string[]) {
    const colleges = await this.prisma.college.findMany({
      where: { id: { in: collegeIds } },
      include: {
        courses: { select: { title: true, tuitionFee: true, duration: true } },
        placements: { orderBy: { year: 'desc' }, take: 1 },
        reviews: { select: { rating: true } },
      },
    });

    if (colleges.length < 2) {
      throw new NotFoundException('Fewer than 2 valid colleges were found for comparison.');
    }

    return colleges.map((college) => {
      const latestPlacement = college.placements[0] || null;
      const fees = college.courses.map((c) => c.tuitionFee);

      return {
        id: college.id,
        name: college.name,
        location: `${college.city}, ${college.state}`,
        rating: college.avgRating,
        totalReviews: college.totalReviews,
        fees: {
          minTuition: fees.length ? Math.min(...fees) : 'N/A',
          maxTuition: fees.length ? Math.max(...fees) : 'N/A',
        },
        placements: latestPlacement
          ? {
              year: latestPlacement.year,
              avgPackage: `${latestPlacement.avgPackage} LPA`,
              highestPackage: `${latestPlacement.highestPackage} LPA`,
              placementRate: `${latestPlacement.placementRate}%`,
            }
          : 'Data Unavailable',
        coursesOfferedCount: college.courses.length,
      };
    });
  }
}