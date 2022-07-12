import { HttpException, Injectable } from '@nestjs/common';
import {
	createWriteStream,
	ReadStream,
	WriteStream,
	unlink,
	stat,
	mkdir,
	Stats,
	rm,
} from 'fs';
import sharp = require('sharp');
import { glob } from 'glob';

// import { FileUpload } from 'graphql-upload';
import { finished } from 'stream/promises';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { finished } = require('stream');
import { join } from 'path';
import { Readable } from 'stream';
// import { fileTypeFromBuffer } from 'file-type';

import type { FileUpload } from 'graphql-upload/processRequest.js';

import { TryCatchWrapper } from '../utils/error-handling/try-catch-wrapper';
// import * as mmm from 'mmmagic';
// import { promisify } from 'util';
import path = require('path');
// const Magic = mmm.Magic;

interface IImageDirectory {
	idFolderPath: string;
	folderType: ['images', 'videos'];
	folderName: ['story', 'profile'];
}

@Injectable()
export class FileStorageService {
	// constructor(){}

	@TryCatchWrapper()
	async convertStreamToBuffer(stream: any): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const _buf: any[] = [];

			stream.on('data', (chunk: any) => _buf.push(chunk));
			stream.on('end', () => resolve(Buffer.concat(_buf)));
			stream.on('error', (err) => reject(err));
		});
	}

	@TryCatchWrapper()
	async graphqlSaveFileToStorage(
		file: FileUpload,
		filePath: string
	): Promise<void> {
		const streamFile: ReadStream = file.createReadStream();

		const convertedStreamToBuffer = await this.convertStreamToBuffer(
			streamFile
		);

		const convertImage2JpegAsBuffer: Buffer = await sharp(
			convertedStreamToBuffer
		)
			.jpeg()
			.toBuffer();

		const buffer2stream = Readable.from(convertImage2JpegAsBuffer);

		const out: WriteStream = createWriteStream(filePath);

		buffer2stream.pipe(out).on('error', (err) => {
			throw new HttpException('Something went wrong', 500);
		});

		finished(out);
	}

	@TryCatchWrapper()
	async isFileTypeSafe<T>(
		file: Buffer,
		fileName: string,
		validFileMimeType: Array<T>
	): Promise<boolean> {
		// const magic = new Magic(mmm.MAGIC_MIME_TYPE);

		const fileExtensionType = path.extname(fileName);

		if (!fileExtensionType.match(/\.(jpeg|png|webp)$/i)) return false;

		// const bitmap = function (file: Buffer): Promise<any> {
		// 	return new Promise(function (resolve, reject): void {
		// 		magic.detect(
		// 			file,
		// 			function (err: Error, data: string | string[]): void {
		// 				if (err) reject(err);
		// 				else resolve(data);
		// 			}
		// 		);
		// 	});
		// };

		// const isFileMimeTypeLegit: boolean = validFileMimeType.includes(
		// 	(await bitmap(file)) as unknown as T
		// );

		return true;
	}

	@TryCatchWrapper()
	async makeDirectoryIfDoesNotExist({
		idFolderPath,
		folderType,
		folderName,
	}: IImageDirectory) {
		for (const type of folderType) {
			for (const folder of folderName) {
				const folderPath = join(idFolderPath, type, folder);
				stat(folderPath, (err: any, stats: Stats) => {
					// If path to folder does not exist make the folders
					if (err) {
						mkdir(
							folderPath,
							{ recursive: true },
							(err: NodeJS.ErrnoException | null, path: string | undefined) => {
								//
								if (err) return null;
							}
						);
					}
				});
			}
		}
	}

	@TryCatchWrapper()
	async removeDirectoryIfDoesExist(UserFolderId: string) {
		stat(UserFolderId, (err: any, stats: Stats) => {
			if (!err) {
				rm(
					UserFolderId,
					{ force: true, recursive: true },
					(err: NodeJS.ErrnoException | null) => {
						//
					}
				);
			} else {
				return;
			}
		});
	}

	@TryCatchWrapper()
	async removeFile(UserFolderId: string, filename: string): Promise<void> {
		const fileFolderPath = join(
			process.cwd(),
			'upload',
			UserFolderId,
			'**',
			filename
		);

		// options is optional
		glob(fileFolderPath, function (err, files: Array<string>) {
			// files is an array of filenames.
			// If the `nonull` option is set, and nothing
			// was found, then files is ["**/*.js"]
			// er is an error object or null.
			if (!err)
				files.forEach((file) =>
					unlink(file, (): void => {
						//
					})
				);
		});
	}
}
