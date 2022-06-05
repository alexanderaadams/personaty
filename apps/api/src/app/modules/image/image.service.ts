import { HttpException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFile, ReadStream } from 'fs';
// import { FileUpload, Upload } from 'graphql-upload';
import type { FileUpload } from 'graphql-upload/processRequest.js';
import type { Upload } from 'graphql-upload/processRequest.js';
import { v5 as uuidv5 } from 'uuid';
import path = require('path');

import { environment } from '@environment';
import { FileStorageService } from '@core/utils/file-storage.service';
import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';

import { TValidImageMimeType } from './utils/types/valid-image-mime.type';
import { TImage } from './utils/types/image.type';
// import { TValidImageExtensions } from './utils/types/valid-image-extensions';
import { IImage } from './utils/image.interface';

@Injectable()
export class ImageService {
	constructor(private fileStorageService: FileStorageService) {}

	@TryCatchWrapper()
	async getImage(imageId: string): Promise<boolean> {
		const imagesFolderPath: string = join(process.cwd(), 'upload');

		const fullImagePath: string = join(imagesFolderPath + '/' + imageId);

		const DoesImageExist = function (): Promise<unknown> {
			return new Promise(function (resolve, reject): void {
				readFile(fullImagePath, 'utf8', function (err, data): void {
					if (err) reject(err);
					else resolve(data);
				});
			});
		};

		if (await DoesImageExist()) return true;

		throw new HttpException('File Does Not Exist', 404);
	}

	@TryCatchWrapper()
	async isMimeTypeSafe(readStream: ReadStream): Promise<boolean> {
		const validImageMimeType: Array<TValidImageMimeType> = [
			'image/png',
			'image/jpg',
			'image/jpeg',
		];

		const readBuffer: Buffer = await this.fileStorageService.stream2buffer(
			readStream
		);

		if (
			!(await this.fileStorageService.isMimeTypeSafe<TValidImageMimeType>(
				readBuffer,
				validImageMimeType
			))
		)
			return false;

		return true;
	}

	@TryCatchWrapper()
	async checkImageLegitimacy(
		graphqlImage: TImage,
		id: string
	): Promise<IImage> {
		const image: FileUpload = (await (graphqlImage as Upload)
			.promise) as FileUpload;

		const myRegex = /.(jpe?g|png)$/gi;

		const checkedFileExtensionIfNotSafe: boolean =
			await this.fileStorageService.isFileExtensionSafe(
				image.filename,
				myRegex
			);

		if (!checkedFileExtensionIfNotSafe) {
			throw new HttpException('File must be a png, jpg/jpeg' ?? 'Error', 400);
		}

		if (!(await this.isMimeTypeSafe(image.createReadStream())))
			throw new HttpException('File must be a png, jpg/jpeg', 400);

		// const fileExtension: string = path.extname(
		// 	image.filename
		// ) as TValidImageExtensions;

		const imageFileName = `${environment.PROJECT_NAME}_${Date.now()}_${uuidv5(
			environment.V5_NAME,
			environment.V5_NAMESPACE_CUSTOM
		)}.jpeg`;

		const fullImagePath: string = join(
			process.cwd(),
			'upload',
			id,
			'images',
			'story',
			imageFileName
		);

		return { imageFileName, fullImagePath, image };
	}
}
