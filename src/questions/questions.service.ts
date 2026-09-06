import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateQuestionDto, CreateAnswerDto } from './dto/questions.dto.js';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create question (Auth required)
  async createQuestion(userId: string, dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        title: dto.title,
        content: dto.content,
        userId,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  }

  // Get all questions
  async findAll() {
    return this.prisma.question.findMany({
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { answers: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get question details with full answers list
  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } },
        answers: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  // Post an answer to a question (Auth required)
  async addAnswer(userId: string, questionId: string, dto: CreateAnswerDto) {
    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    if (!question) throw new NotFoundException('Question not found');

    return this.prisma.answer.create({
      data: {
        content: dto.content,
        questionId,
        userId,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  }
}