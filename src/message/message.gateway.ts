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
  async getConversation(@MessageBody('chatRoomId') chatRoomId: number) {
    if (!chatRoomId) return;
    const chatRoom = await this.conversationService.byId(chatRoomId);
    this.server.to(String(chatRoomId)).emit('chatRoom', chatRoom);
  }

  @SubscribeMessage('message:add')
  async addMessage(@MessageBody() dto: CreateMessageDto) {
    await this.messageService.create(dto.userFromId, dto);
    await this.getConversation(dto.conversationId);
  }

  @SubscribeMessage('joinRoom')
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody('chatRoomId') chatRoomId: number
  ) {
    client.join(String(chatRoomId));
    client.emit('joinedRoom', chatRoomId);
    await this.getConversation(chatRoomId);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody('chatRoomId') chatRoomId: string
  ) {
    client.leave(chatRoomId);
    client.emit('leftRoom', chatRoomId);
  }

  @SubscribeMessage('message:delete')
  async deleteMessage(@MessageBody() dto: DeleteMessageDto) {
    await this.messageService.remove(dto.messageId, dto.conversationId);
    await this.getConversation(dto.conversationId);
  }
}
