import {
  Controller,
  HttpCode,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @HttpCode(200)
  @Post()
  @Auth()
  @UseInterceptors(FileInterceptor('image'))
  async uploadsMediaFile(
    @UploadedFile() mediaFile: Express.Multer.File,
    @Query('folder') folder?: string
  ) {
    console.log(mediaFile, folder);
    console.log('nne');

    return this.mediaService.saveMedia(mediaFile, folder);
  }
}
