import { HttpException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFile, ReadStream } from 'fs';
import { FileUpload, Upload } from 'graphql-upload';
import { v5 as uuidv5 } from 'uuid';
import path = require('path');
import BufferListStream = require('bl');
import buffer = require('get-stream');

import { environment } from '@environment';

import {
	isFileExtensionSafe,
	isMimeTypeSafe,
	makeDirectoryIfDoesNotExist,
	removeDirectoryIfDoesExist,
} from '../file-storage';
import { TryCatchWrapper } from '../error-handling/try-catch-wrapper';
import { TValidImageMimeType } from './utils/types/valid-image-mime.type';
import { TImage } from './utils/types/image.type';
import { TValidImageExtensions } from './utils/types/valid-image-extensions';
import { TImageFolder } from './utils/types/image-folder.type';
import { IImage } from './utils/image.interface';

@Injectable()
export class ImageService {
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
	async stream2buffer(stream): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const _buf: any[] = [];

			stream.on('data', (chunk: any) => _buf.push(chunk));
			stream.on('end', () => resolve(Buffer.concat(_buf)));
			stream.on('error', (err) => reject(err));
		});
	}

	@TryCatchWrapper()
	async isMimeTypeSafe(readStream: ReadStream) {
		const validImageMimeType: Array<TValidImageMimeType> = [
			'image/png',
			'image/jpg',
			'image/jpeg',
		];

		const readBuffer = await this.stream2buffer(readStream);

		if (
			!(await isMimeTypeSafe<TValidImageMimeType>(
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

		const checkedFileExtensionIfNotSafe = await isFileExtensionSafe(
			image.filename,
			myRegex
		);

		if (!checkedFileExtensionIfNotSafe) {
			throw new HttpException('File must be a png, jpg/jpeg' ?? 'Error', 400);
		}

		if (!(await this.isMimeTypeSafe(image.createReadStream())))
			throw new HttpException('File must be a png, jpg/jpeg', 400);

		const fileExtension: string = path.extname(
			image.filename
		) as TValidImageExtensions;

		const fileName = `${environment.PROJECT_NAME}_${Date.now()}_${uuidv5(
			environment.V5_NAME,
			environment.V5_NAMESPACE_CUSTOM
		)}${fileExtension}`;

		const fullImagePath: string = join(
			process.cwd(),
			'upload',
			id,
			'images',
			'story',
			fileName
		);
		// makeDirectoryIfDoesNotExist({
		// 	idFolderPath: join(process.cwd(), 'upload', id),
		// 	types: ['images', 'videos'],
		// 	folders: ['story', 'profile'],
		// });
		removeDirectoryIfDoesExist(join(process.cwd(), 'upload', id));

		return { fileName, fullImagePath, image };
	}
}
