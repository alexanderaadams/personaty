import { Module } from '@nestjs/common';
import { FileStorageService } from '@core/utils/file-storage.service';
import { ImageService } from './image.service';

@Module({
	providers: [ImageService, FileStorageService],
	exports: [ImageService],
})
export class ImageModule {}
