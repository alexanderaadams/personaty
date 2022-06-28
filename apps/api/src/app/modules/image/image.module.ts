import { Global, Module } from '@nestjs/common';
import { FileStorageService } from '@core/services/file-storage.service';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { ImageResolver } from './image.resolver';

@Global()
@Module({
	controllers: [ImageController],
	providers: [ImageService, FileStorageService, ImageResolver],
	exports: [ImageService],
})
export class ImageModule {}
