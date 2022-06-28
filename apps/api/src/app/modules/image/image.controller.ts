import { Express } from 'express';
import { Controller, Get, Param, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { ImageService } from './image.service';
import { TokenAuthGuard } from '@core/guards/is-auth.guard';

@Controller('picture')
@UseGuards(TokenAuthGuard)
export class ImageController {
	constructor(private readonly imageService: ImageService) {}

	// @Post('upload/:id')
	// @UseInterceptors(FileInterceptor('file', saveImageToStorage))
	// async uploadImage(
	// 	@UploadedFile() file: Express.Multer.File,
	// 	@Param('id') id: string
	// ) {
	// 	await this.imageService.uploadImage(file, id);
	// 	return { status: "User's profile picture has been uploaded successfully" };
	// }

	@Get(':userId/:pictureName')
	async getImage(
		@Param(':pictureName') pictureName: string,
		@Param(':userId') userId: string,
		@Res() res: Response
	) {
		return await this.imageService.getImage(userId, pictureName + '.jpeg');
		// if (await this.imageService.getImage(userId, pictureName))
		// return res.sendFile(imageId, { root: 'upload' });
	}
}
