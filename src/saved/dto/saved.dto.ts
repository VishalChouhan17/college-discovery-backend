import { IsString, IsArray, ArrayMinSize, ArrayMaxSize, IsOptional } from 'class-validator';

export class SaveCollegeDto {
  @IsString()
  collegeId: string;
}

export class SaveComparisonDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(3)
  collegeIds: string[];

  @IsOptional()
  @IsString()
  title?: string;
}