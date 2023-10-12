import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { VideoService } from './video.service';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @HttpCode(200)
  @Post()
  @Auth('admin')
  create() {
    return this.videoService.create();
  }

  @Get()
  @Auth()
  findAll() {
    return this.videoService.findAll();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.videoService.byId(+id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth('admin')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  @Auth('admin')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }
}
