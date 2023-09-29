import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationService } from '../conversation/conversation.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { MessageService } from './message.service';

@WebSocketGateway(80, { cors: true })
export class MessageGateway {
  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message:get')
  async getConversation(@MessageBody('conversationId') conversationId: number) {
    if (!conversationId) return;
    const conversation = await this.conversationService.byId(conversationId);
    this.server.to(String(conversationId)).emit('conversation', conversation);
  }

  @SubscribeMessage('message:add')
  async addMessage(@MessageBody() dto: CreateMessageDto) {
    await this.messageService.create(dto.userFromId, dto);
    await this.getConversation(dto.conversationId);
  }

  @SubscribeMessage('joinRoom')
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody('conversationId') conversationId: number
  ) {
    client.join(String(conversationId));
    client.emit('joinedRoom', conversationId);
    await this.getConversation(conversationId);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody('conversationId') conversationId: string
  ) {
    client.leave(conversationId);
    client.emit('leftRoom', conversationId);
  }

  @SubscribeMessage('message:delete')
  async deleteMessage(@MessageBody() dto: DeleteMessageDto) {
    await this.messageService.remove(dto.messageId, dto.conversationId);
    await this.getConversation(dto.conversationId);
  }
}
