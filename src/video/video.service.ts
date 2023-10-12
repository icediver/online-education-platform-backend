import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from 'src/conversation/entities/conversation.entity';
import { FindOptionsWhereProperty, ILike, Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoEntity } from './entities/video.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>
  ) {}

  async byId(id: number) {
    const video = await this.videoRepository.findOne({
      where: { id },
      relations: {
        conversation: { messages: true }
      }
    });
    if (!video) throw new NotFoundException('Видео не найдено!');
    return video;
  }

  async create() {
    const defaultValues = {
      source: '',
      chapter: '',
      slug: '',
      title: '',
      overview: '',
      chapterTopics: []
    };
    const newVideo = this.videoRepository.create(defaultValues);
    const video = await this.videoRepository.save(newVideo);
    return video.id;
  }

  async update(id: number, dto: UpdateVideoDto) {
    const video = await this.byId(id);

    let conversation = {};

    if (!video.conversation) {
      const newConverstation = this.conversationRepository.create();
      await this.conversationRepository.save(newConverstation);
      conversation = { conversation: { id: newConverstation.id } };
    }

    return this.videoRepository.save({ ...video, ...conversation, ...dto });
  }
  async findAll(searchTerm?: string) {
    let options: FindOptionsWhereProperty<VideoEntity> = {};

    if (searchTerm)
      options = {
        title: ILike(`%${searchTerm}%`)
      };

    return this.videoRepository.find({
      where: {
        ...options
      },
      order: {
        createdAt: 'DESC'
      },
      relations: {
        conversation: { messages: true }
      }
    });
  }

  remove(id: number) {
    return this.videoRepository.delete({ id });
  }
}
