import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SavedService } from './saved.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { SaveCollegeDto, SaveComparisonDto } from './dto/saved.dto.js';

// Define typed request interface for JWT payload attached by Passport
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    name: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('saved')
export class SavedController {
  constructor(private readonly savedService: SavedService) {}

  @Post('colleges')
  saveCollege(@Request() req: AuthenticatedRequest, @Body() dto: SaveCollegeDto) {
    return this.savedService.saveCollege(req.user.userId, dto);
  }

  @Get('colleges')
  getSavedColleges(@Request() req: AuthenticatedRequest) {
    return this.savedService.getSavedColleges(req.user.userId);
  }

  @Delete('colleges/:collegeId')
  removeSavedCollege(
    @Request() req: AuthenticatedRequest,
    @Param('collegeId') collegeId: string,
  ) {
    return this.savedService.removeSavedCollege(req.user.userId, collegeId);
  }

  @Post('comparisons')
  saveComparison(@Request() req: AuthenticatedRequest, @Body() dto: SaveComparisonDto) {
    return this.savedService.saveComparison(req.user.userId, dto);
  }

  @Get('comparisons')
  getSavedComparisons(@Request() req: AuthenticatedRequest) {
    return this.savedService.getSavedComparisons(req.user.userId);
  }
}