import { ArrayMinSize, ArrayMaxSize, IsArray, IsString } from 'class-validator';

export class CompareCollegesDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(3)
  ids: string[];
}