import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;
  @IsOptional()
  @IsString()
  phone?: string;
  @IsOptional()
  @IsString()
  password?: string;
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsOptional()
  @IsString()
  avatarPath?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  position?: string = 'student';

  @IsOptional()
  @IsNumber()
  year: number;

  @IsOptional()
  @IsNumber()
  semester: number;
}
