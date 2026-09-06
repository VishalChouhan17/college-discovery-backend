import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PredictCollegesDto } from './dto/predict-colleges.dto.js';

@Injectable()
export class PredictorService {
  constructor(private readonly prisma: PrismaService) {}

  async predict(dto: PredictCollegesDto) {
    const { exam, rank, category = 'General' } = dto;

    // Fetch cutoffs matching the exam and category where the closing rank is within range (+20% tolerance)
    const cutoffs = await this.prisma.cutoff.findMany({
      where: {
        examName: { equals: exam, mode: 'insensitive' },
        category: { equals: category, mode: 'insensitive' },
        closingRank: { gte: Math.floor(rank * 0.8) }, // Includes target, safe, and reach options
      },
      include: {
        course: {
          include: {
            college: {
              select: {
                id: true,
                name: true,
                slug: true,
                city: true,
                state: true,
                nirfRank: true,
                avgRating: true,
                logo: true,
              },
            },
          },
        },
      },
      orderBy: { closingRank: 'asc' },
    });

    return cutoffs.map((cutoff) => {
      let probability: 'High' | 'Moderate' | 'Low' = 'Low';

      // High probability: User's rank is comfortably better than or equal to previous closing rank
      if (rank <= cutoff.closingRank) {
        probability = 'High';
      } 
      // Moderate probability: User's rank is slightly above the closing rank (within 10%)
      else if (rank <= cutoff.closingRank * 1.1) {
        probability = 'Moderate';
      }

      return {
        college: {
          id: cutoff.course.college.id,
          name: cutoff.course.college.name,
          slug: cutoff.course.college.slug,
          location: `${cutoff.course.college.city}, ${cutoff.course.college.state}`,
          nirfRank: cutoff.course.college.nirfRank,
          rating: cutoff.course.college.avgRating,
          logo: cutoff.course.college.logo,
        },
        course: {
          id: cutoff.course.id,
          title: cutoff.course.title,
          tuitionFee: cutoff.course.tuitionFee,
        },
        cutoffInfo: {
          examName: cutoff.examName,
          year: cutoff.year,
          category: cutoff.category,
          openingRank: cutoff.openingRank,
          closingRank: cutoff.closingRank,
          userRank: rank,
        },
        admissionProbability: probability,
      };
    });
  }
}