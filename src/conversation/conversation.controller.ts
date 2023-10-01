import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { User as CurrentUser } from '../user/decorators/user.decorator';
import { ConversationService } from './conversation.service';
import { ConversationDto } from './dto/conversation.dto';

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
  @Auth()
  async createConversation(@CurrentUser('id') currentUserId: number) {
    return this.conversationService.create(currentUserId);
  }
}
