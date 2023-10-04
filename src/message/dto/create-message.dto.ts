import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsOptional()
  @IsString()
  text: string;
  @IsOptional()
  @IsString()
  image: string;

  @IsNumber()
  @IsOptional()
  userFromId: number;
  //
  // @IsNumber()
  // userToId: number;
  //
  @IsNumber()
  conversationId: number;
}
