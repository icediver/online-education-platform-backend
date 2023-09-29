import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { User as CurrentUser } from '../user/decorators/user.decorator';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  //--------------------Create--------------------//
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  create(
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser('id') userId: number
  ) {
    return this.messageService.create(userId, createMessageDto);
  }

  //--------------------Read----------------------//
  @Get('recent-list')
  @Auth()
  async getRecentMessages(@CurrentUser('id') userFromId: number) {
    return this.messageService.byUserFromId(userFromId);
  }

  @Get('conversation/:userToId')
  @Auth()
  async getByUserId(
    @Param('userToId') userToId: number,
    @CurrentUser('id') userFromId
  ) {
    return this.messageService.byUserToId(userFromId, userToId);
  }

  //--------------------Update--------------------//

  //--------------------Delete--------------------//
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async deleteMessage(
    @Param('id') id: number,
    @Query('conversationId') conversationId: number
  ) {
    return this.messageService.remove(id, conversationId);
  }
}
