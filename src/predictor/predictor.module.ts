import { Module } from '@nestjs/common';
import { PredictorController } from './predictor.controller.js';
import { PredictorService } from './predictor.service.js';

@Module({
  controllers: [PredictorController],
  providers: [PredictorService],
})
export class PredictorModule {}