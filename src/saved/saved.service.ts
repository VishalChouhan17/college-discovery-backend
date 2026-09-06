import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SaveCollegeDto, SaveComparisonDto } from './dto/saved.dto.js';

@Injectable()
export class SavedService {
  constructor(private readonly prisma: PrismaService) {}

  // Save a college
  async saveCollege(userId: string, dto: SaveCollegeDto) {
    const existing = await this.prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId, collegeId: dto.collegeId } },
    });

    if (existing) throw new ConflictException('College already saved');

    return this.prisma.savedCollege.create({
      data: { userId, collegeId: dto.collegeId },
      include: { college: true },
    });
  }

  // Get saved colleges
  async getSavedColleges(userId: string) {
    return this.prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            state: true,
            avgRating: true,
            nirfRank: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Remove saved college
  async removeSavedCollege(userId: string, collegeId: string) {
    const item = await this.prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId, collegeId } },
    });
    if (!item) throw new NotFoundException('Saved item not found');

    return this.prisma.savedCollege.delete({
      where: { userId_collegeId: { userId, collegeId } },
    });
  }

  // Save comparison session
  async saveComparison(userId: string, dto: SaveComparisonDto) {
    return this.prisma.savedComparison.create({
      data: {
        userId,
        collegeIds: dto.collegeIds,
        title: dto.title || 'Saved Comparison',
      },
    });
  }

  // Get saved comparisons
  async getSavedComparisons(userId: string) {
    return this.prisma.savedComparison.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}