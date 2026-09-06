import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { CollegesModule } from './colleges/colleges.module.js';
import { PredictorModule } from './predictor/predictor.module.js';
import { AuthModule } from './auth/auth.module.js';
import { SavedModule } from './saved/saved.module.js';
import { QuestionsModule } from './questions/questions.module.js';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Loads .env globally
    PrismaModule,
    CollegesModule,
    PredictorModule,
    AuthModule,
    SavedModule,
    QuestionsModule,
  ],
})
export class AppModule {}