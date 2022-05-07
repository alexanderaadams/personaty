// import { Express } from 'express';
// import { saveImageToStorage } from './image-storage';
// import {
// 	Controller,
// 	Get,
// 	Param,
// 	UseGuards,
// 	UseInterceptors,
// 	Post,
// 	UploadedFile,
// 	Res,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { Response } from 'express';
// import { ImageService } from './image.service';
// import { TokenAuthGuard } from '../core/utils/guards/is-auth.guard';

// @Controller('picture')
// @UseGuards(TokenAuthGuard)
// export class ImageController {
// 	constructor(private readonly imageService: ImageService) {}

// 	@Post('upload/:id')
// 	@UseInterceptors(FileInterceptor('file', saveImageToStorage))
// 	async uploadImage(
// 		@UploadedFile() file: Express.Multer.File,
// 		@Param('id') id: string
// 	) {
// 		await this.imageService.uploadImage(file, id);
// 		return { status: "User's profile picture has been uploaded successfully" };
// 	}

// 	@Get(':imageId')
// 	async getImage(@Param('imageId') imageId: string, @Res() res: Response) {
// 		// console.log(imageId);
// 		// const { profilePicture } =

// 		if (await this.imageService.getImage(imageId))
// 			return res.sendFile(imageId, { root: 'upload' });
// 	}
// }
