import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get(':id')
  @Auth()
  async getById(@Param('id') id: number) {
    return this.conversationService.byId(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth('admin')
  async createConversation() {
    return this.conversationService.create();
  }
}
