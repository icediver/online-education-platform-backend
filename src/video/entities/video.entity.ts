import { ConversationEntity } from 'src/conversation/entities/conversation.entity';
import { Base } from 'src/utils/base';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('Video')
export class VideoEntity extends Base {
  @Column({ default: '' })
  source: string;
  @Column({ default: '' })
  chapter: string;
  @Column({ default: '' })
  slug: string;
  @Column({ default: '' })
  title: string;
  @Column({ default: '' })
  overview: string;
  @Column('text', { name: 'chapter_topics', array: true })
  chapterTopics: string[];
  @OneToOne(() => ConversationEntity)
  @JoinColumn()
  conversation: ConversationEntity;
}
