import { HttpException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFile } from 'fs';
import { FileUpload } from 'graphql-upload';

import { isFileExtensionSafe, removeFile } from './image-storage';
import { TryCatchWrapper } from '../error-handling/try-catch-wrapper';

interface ImageLegitimacy {
	valid: boolean;
	error: string | null;
	fullImagePath: string;
}

@Injectable()
export class ImageService {
	@TryCatchWrapper()
	async getImage(imageId): Promise<boolean> {
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
	async checkImageLegitimacy(file: FileUpload): Promise<ImageLegitimacy> {
		const fileName: string = file?.filename;

		if (!fileName)
			return {
				valid: false,
				error: 'File must be a png, jpg/jpeg',
				fullImagePath: 'Error',
			};

		const imagesFolderPath: string = join(process.cwd(), 'upload');

		const fullImagePath: string = join(imagesFolderPath + '/' + file.filename);

		const isFileLegit: boolean = await isFileExtensionSafe(fullImagePath);

		if (isFileLegit)
			return {
				valid: false,
				error: null,
				fullImagePath,
			} as ImageLegitimacy;

		removeFile(fullImagePath);

		return {
			valid: false,
			error: 'File content does not match extension!',
			fullImagePath: 'Error',
		} as ImageLegitimacy;
	}
}
