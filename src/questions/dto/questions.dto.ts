import { IsString, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(10)
  content: string;
}

export class CreateAnswerDto {
  @IsString()
  @MinLength(5)
  content: string;
}