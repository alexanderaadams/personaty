import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { UserModule } from '../user/users.module';
import { MyJWTModule } from '../jwt/jwt.module';

@Module({
	controllers: [ImageController],
	imports: [UserModule, MyJWTModule],
	providers: [ImageService],
})
export class ImageModule {}
