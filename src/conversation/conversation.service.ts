import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from '../message/entities/message.entity';
import { ConversationEntity } from './entities/conversation.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>
  ) {}

  //--------------------Read----------------------//
  async byId(id: number) {
    return this.conversationRepository.findOne({
      where: { id },
      relations: { messages: { userFrom: true } }
    });
  }

  //--------------------Create--------------------//
  async create(currentUserId: number) {
    const message = await this.messageRepository.findOne({
      where: {
        userFrom: { id: currentUserId }
      },
      relations: { conversation: true }
    });

    if (message) {
      return this.conversationRepository.findOne({
        where: { id: message.conversation.id },
        relations: { messages: true }
      });
    }

    const conversation = this.conversationRepository.create({
      messages: []
    });

    return this.conversationRepository.save(conversation);
  }
}
