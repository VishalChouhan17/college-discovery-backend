import { IsString, IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PredictCollegesDto {
  @IsString()
  exam: string; // e.g., "JEE Main" or "JEE Advanced"

  @Type(() => Number)
  @IsInt()
  @Min(1)
  rank: number; // e.g., 15000

  @IsOptional()
  @IsString()
  category?: string = 'General';
}