import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoEntity } from 'src/video/entities/video.entity';
import { ConversationService } from '../conversation/conversation.service';
import { ConversationEntity } from '../conversation/entities/conversation.entity';
import { MessageEntity } from './entities/message.entity';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, ConversationEntity])],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway, ConversationService]
})
export class MessageModule {}
