import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CollegesService } from './colleges.service.js';
import { GetCollegesDto } from './dto/get-colleges.dto.js';
import { CompareCollegesDto } from './dto/compare-colleges.dto.js';

@Controller('colleges')
export class CollegesController {
  constructor(private readonly collegesService: CollegesService) {}

  @Get()
  findAll(@Query() query: GetCollegesDto) {
    return this.collegesService.findAll(query);
  }

  @Post('compare')
  compare(@Body() dto: CompareCollegesDto) {
    return this.collegesService.compareColleges(dto.ids);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.collegesService.findBySlug(slug);
  }
}