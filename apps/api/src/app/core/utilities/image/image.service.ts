import { HttpException, Injectable } from '@nestjs/common';
import { isFileExtensionSafe, removeFile } from './image-storage';
import { join } from 'path';
import { readFile } from 'fs';
import { UserService } from '../../../user/user.service';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class ImageService {
	constructor(private readonly userService: UserService) {}

	async getImage(imageId): Promise<boolean> {
		try {
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
		} catch (err) {
			throw new HttpException('Something Went Wrong', 500);
		}
	}

	async checkImageLegitimacy(file: FileUpload) {
		try {
			const fileName = file?.filename;

			if (!fileName)
				return { valid: false, error: 'File must be a png, jpg/jpeg' };

			const imagesFolderPath = join(process.cwd(), 'upload');

			const fullImagePath = join(imagesFolderPath + '/' + file.filename);

			const isFileLegit = await isFileExtensionSafe(fullImagePath);

			if (isFileLegit)
				return {
					valid: false,
					fullImagePath,
				};

			removeFile(fullImagePath);

			return {
				valid: false,
				error: 'File content does not match extension!',
			};
		} catch (err) {
			throw new HttpException('Something Went Wrong', 500);
		}
	}
}
