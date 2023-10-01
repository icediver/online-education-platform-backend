import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  phone?: string;
  @IsString()
  password?: string;
  @IsBoolean()
  isAdmin?: boolean;

  @IsString()
  avatarPath?: string;

  @IsString()
  name?: string;

  @IsString()
  @IsOptional()
  position?: string = 'student';
}
