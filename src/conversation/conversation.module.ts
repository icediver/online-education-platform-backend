import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoEntity } from 'src/video/entities/video.entity';
import { MessageEntity } from '../message/entities/message.entity';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ConversationEntity } from './entities/conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationEntity, MessageEntity])],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService]
})
export class ConversationModule {}
