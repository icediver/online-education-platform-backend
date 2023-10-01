import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { IMediaResponse } from './media.interface';
import { ensureDir, writeFile } from 'fs-extra';
@Injectable()
export class MediaService {
  async saveMedia(
    mediaFile: Express.Multer.File,
    folder = 'media'
  ): Promise<IMediaResponse> {
    const uploadFolder = `${path}/uploads/${folder}`;
    await ensureDir(uploadFolder);

    await writeFile(
      `${uploadFolder}/${mediaFile.originalname}`,
      mediaFile.buffer
    );

    return {
      url: `/uploads/${folder}/${mediaFile.originalname}`,
      name: mediaFile.originalname
    };
  }
}
