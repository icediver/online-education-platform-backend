import { IsNumber, IsString } from 'class-validator';

export class CreateExamDto {
  @IsNumber()
  semester: number;
  @IsNumber()
  year: number;
  @IsString()
  subject: string;
  @IsString()
  date: string;
  @IsString()
  description: string;
}
