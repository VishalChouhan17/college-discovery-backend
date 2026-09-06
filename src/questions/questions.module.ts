import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller.js';
import { QuestionsService } from './questions.service.js';
import { AuthModule } from '../auth/auth.module.js'; // <-- Add AuthModule import


@Module({
  imports: [AuthModule],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})


export class QuestionsModule {
    
}

