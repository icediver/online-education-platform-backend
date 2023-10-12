import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateVideoDto } from './create-video.dto';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
  @IsString()
  source: string;
  @IsString()
  chapter: string;
  @IsString()
  slug: string;
  @IsString()
  title: string;
  @IsString()
  overview: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  chapterTopics: string[];
}
