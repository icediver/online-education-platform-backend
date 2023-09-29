import { Entity, OneToMany } from 'typeorm';
import { MessageEntity } from '../../message/entities/message.entity';
import { Base } from '../../utils/base';

@Entity('Conversation')
export class ConversationEntity extends Base {
  @OneToMany(() => MessageEntity, message => message.conversation)
  // @JoinTable({ name: 'conversation' })
  messages?: MessageEntity[];
}
