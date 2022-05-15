import { HttpException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFile } from 'fs';
import { FileUpload } from 'graphql-upload';

import { isFileExtensionSafe, removeFile } from './image-storage';
import { UserService } from '@features/user/user.service';
import { TryCatchWrapper } from '../error-handling/try-catch-wrapper';

@Injectable()
export class ImageService {
	constructor(private readonly userService: UserService) {}

	@TryCatchWrapper()
	async getImage(imageId): Promise<boolean> {
		const imagesFolderPath = join(process.cwd(), 'upload');

		const fullImagePath = join(imagesFolderPath + '/' + imageId);

		const DoesImageExist = function () {
			return new Promise(function (resolve, reject) {
				readFile(fullImagePath, 'utf8', function (err, data) {
					if (err) reject(err);
					else resolve(data);
				});
			});
		};

		if (await DoesImageExist()) return true;

		throw new HttpException('File Does Not Exist', 404);
	}

	@TryCatchWrapper()
	async checkImageLegitimacy(file: FileUpload) {
		const fileName = file?.filename;

		if (!fileName)
			return { valid: false, error: 'File must be a png, jpg/jpeg' };

		const imagesFolderPath = join(process.cwd(), 'upload');

		const fullImagePath = join(imagesFolderPath + '/' + file.filename);

		const isFileLegit = await isFileExtensionSafe(fullImagePath);

		if (isFileLegit)
			return {
				valid: false,
				error: null,
				fullImagePath,
			};

		removeFile(fullImagePath);

		return {
			valid: false,
			error: 'File content does not match extension!',
			fullImagePath: 'Error',
		};
	}
}
