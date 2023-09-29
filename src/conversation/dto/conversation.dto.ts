import { IsNumber } from 'class-validator';

export class ConversationDto {
  @IsNumber()
  withUserId: number;
}
