import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { QuestionsService } from './questions.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreateQuestionDto, CreateAnswerDto } from './dto/questions.dto.js';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    name: string;
  };
}

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  findAll() {
    return this.questionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createQuestion(@Request() req: AuthenticatedRequest, @Body() dto: CreateQuestionDto) {
    return this.questionsService.createQuestion(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/answers')
  addAnswer(
    @Request() req: AuthenticatedRequest,
    @Param('id') questionId: string,
    @Body() dto: CreateAnswerDto,
  ) {
    return this.questionsService.addAnswer(req.user.userId, questionId, dto);
  }
}