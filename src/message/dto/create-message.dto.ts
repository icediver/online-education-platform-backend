import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  text: string;

  @IsNumber()
  @IsOptional()
  userFromId: number;

  @IsNumber()
  userToId: number;

  @IsNumber()
  conversationId: number;
}
