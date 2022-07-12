import { HttpException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { createReadStream, readFile, ReadStream, stat, Stats } from 'fs';
// import { FileUpload, Upload } from 'graphql-upload';
import type { FileUpload } from 'graphql-upload/processRequest.js';
import type { Upload } from 'graphql-upload/processRequest.js';
import { v5 as uuidv5 } from 'uuid';

import { environment } from '@environment';
import { FileStorageService } from '@core/services/file-storage.service';
import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';

import { TImage } from './utils/types/image.type';
import { IImage } from './utils/interfaces/image.interface';
import { TValidImageMimeType } from './utils/types/valid-image-mime.type';
import glob = require('glob');

@Injectable()
export class ImageService {
	constructor(private fileStorageService: FileStorageService) {}

	@TryCatchWrapper()
	async getImage(userId: string, pictureName: string) {
		const filePath = join(
			process.cwd(),
			'upload',
			userId,
			'images',
			'**',
			pictureName
		);
		let image;

		glob(filePath, function (err, files: Array<string>) {
			if (!err) image = createReadStream(files[0]);

			throw new HttpException('File Does Not Exist', 404);
		});
		// const DoesImageExist: ReadStream = await new Promise(function (
		// 	resolve,
		// 	reject
		// ) {
		// 	stat(filePath, (err: NodeJS.ErrnoException | null, stats: Stats) => {
		// 		// If path to folder does not exist make the folders
		// 		if (!err) {
		// 			resolve(createReadStream(filePath));
		// 		}
		// 		reject(err);
		// 	});
		// });

		// const DoesImageExist = Promise.resolve(createReadStream(filePath));

		// const DoesImageExist = await new Promise(function (resolve, reject): void {

		// 	readFile(filePath, function (err, data): void {
		// 		console.log(err, data);
		// 		if (!err) resolve(data.toString('base64'));

		// 		reject({ message: 'File Does Not Exist', statusCode: 404 });
		// 	});
		// });

		// if (DoesImageExist) return DoesImageExist;

		// throw new HttpException('File Does Not Exist', 404);
	}

	@TryCatchWrapper()
	async checkImageLegitimacy(
		graphqlImage: TImage,
		id: string,
		folderToStore: 'story' | 'profile'
	): Promise<IImage> {
		const image: FileUpload = (await (graphqlImage as Upload)
			?.promise) as FileUpload;

		const validImageMimeType: Array<TValidImageMimeType> = [
			'image/png',
			'image/jpeg',
			'image/webp',
		];

		if (!image)
			throw new HttpException('File must be a png, jpeg ,webp' ?? 'Error', 400);

		const readBuffer: Buffer =
			await this.fileStorageService.convertStreamToBuffer(
				image.createReadStream()
			);

		const checkedFileTypeIfNotSafe =
			await this.fileStorageService.isFileTypeSafe<TValidImageMimeType>(
				readBuffer,
				image.filename,
				validImageMimeType
			);

		if (!checkedFileTypeIfNotSafe)
			throw new HttpException('File must be a png, jpeg, webp' ?? 'Error', 400);

		const imageFileName = `${
			environment.PROJECT_NAME_Shortcut
		}_${Date.now()}_${uuidv5(
			environment.V5_NAME,
			environment.V5_NAMESPACE_CUSTOM
		).replaceAll('-', '')}.jpeg`;

		const fullImagePath: string = join(
			process.cwd(),
			'upload',
			id,
			'images',
			folderToStore,
			imageFileName
		);

		return { imageFileName, fullImagePath, image };
	}
}
