import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationEntity } from '../conversation/entities/conversation.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>
  ) {}

  //--------------------Create--------------------//
  async create(
    userId: number,
    { userToId, text, conversationId }: CreateMessageDto
  ) {
    const newMessage = await this.messageRepository.create({
      userFrom: { id: userId },
      userTo: { id: userToId },
      text: text
    });

    const message = await this.messageRepository.save(newMessage);

    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: { messages: true }
    });

    if (!conversation) throw new NotFoundException('Диалог не найден!');

    conversation.messages = [...conversation.messages, message];
    return this.conversationRepository.save(conversation);
  }

  //--------------------Read----------------------//
  async byUserFromId(userFromId: number) {
    return this.messageRepository.find({
      where: { userFrom: { id: userFromId } },
      relations: { userFrom: true, userTo: true },
      select: {
        userFrom: { name: true, avatarPath: true },
        userTo: { name: true, avatarPath: true }
      },
      order: { createdAt: 'desc' }
    });
  }

  async byUserToId(userFromId: number, userToId: number) {
    return this.messageRepository.find({
      where: [
        {
          userFrom: { id: userFromId },
          userTo: { id: userToId }
        },
        {
          userFrom: { id: userToId },
          userTo: { id: userFromId }
        }
      ],

      select: {
        userFrom: { name: true, avatarPath: true },
        userTo: { name: true, avatarPath: true }
      },
      order: { createdAt: 'desc' }
    });
  }

  //--------------------Update--------------------//

  //--------------------Delete--------------------//
  async remove(id: number, conversationId: number) {
    const deleteMessage = this.messageRepository.delete({ id });
    if (!deleteMessage) throw new NotFoundException('Message not found');

    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: { messages: true }
    });

    if (!conversation) throw new NotFoundException('Диалог не найден!');

    conversation.messages = await conversation.messages.filter(
      msg => msg.id !== id
    );

    const newConversation = await this.conversationRepository.save(
      conversation
    );

    return newConversation;
  }
}
