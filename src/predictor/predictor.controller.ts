import { Controller, Get, Query } from '@nestjs/common';
import { PredictorService } from './predictor.service.js';
import { PredictCollegesDto } from './dto/predict-colleges.dto.js';

@Controller('predictor')
export class PredictorController {
  constructor(private readonly predictorService: PredictorService) {}

  // GET /predictor?exam=JEE Main&rank=15000&category=General
  @Get()
  predict(@Query() dto: PredictCollegesDto) {
    return this.predictorService.predict(dto);
  }
}