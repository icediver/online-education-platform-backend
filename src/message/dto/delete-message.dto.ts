import { IsNumber } from 'class-validator';

export class DeleteMessageDto {
  @IsNumber()
  messageId: number;

  @IsNumber()
  conversationId: number;
}
