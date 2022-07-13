import {
	Controller,
	Get,
	Param,
	UseGuards,
	Res,
	StreamableFile,
	HttpException,
	Header,
} from '@nestjs/common';
import { Response } from 'express';
import { ImageService } from './image.service';
import { TokenAuthGuard } from '@core/guards/is-auth.guard';
import { join } from 'path';
import glob = require('glob');

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

	@Get(':id/:pictureName')
	@Header('Content-Type', 'image/jpeg')
	async getImage(
		@Param('pictureName') pictureName: string,
		@Param('id') id: string,
		@Res() res: Response
	) {

		// res.type('jpeg');
		const filePath = join(
			process.cwd(),
			'upload',
			id,
			'images',
			'**',
			pictureName
		);

		glob(filePath, function (err, files: Array<string>) {
	
			if (files.length && !err) {
				return res.sendFile(files[0]);
			}

			res.status(404).json({
				statusCode: 404,
				message: 'Image does not exist',
			});
		});
		// return new StreamableFile(createReadStream(filePath));

		// const file =
		// file.pipe(res);
		// if (await this.imageService.getImage(id, pictureName))
		// return res.sendFile(imageId, { root: 'upload' });
	}
}
