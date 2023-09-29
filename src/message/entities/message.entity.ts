import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ConversationEntity } from '../../conversation/entities/conversation.entity';
import { UserEntity } from '../../user/user.entity';
import { Base } from '../../utils/base';

@Entity('Message')
export class MessageEntity extends Base {
  @Column()
  text: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_from' })
  userFrom: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_to' })
  userTo: UserEntity;

  @ManyToOne(() => ConversationEntity)
  @JoinColumn({ name: 'conversation' })
  conversation: ConversationEntity;
}
