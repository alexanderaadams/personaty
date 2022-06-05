import { Global, Module } from '@nestjs/common';
import { FileStorageService } from '@core/utils/file-storage.service';
import { ImageService } from './image.service';

@Global()
@Module({
	providers: [ImageService, FileStorageService],
	exports: [ImageService],
})
export class ImageModule {}
