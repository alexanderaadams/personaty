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

// import { FileUpload } from 'graphql-upload';
import type { FileUpload } from 'graphql-upload/processRequest.js';
// import { finished } from 'stream/promises';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const finished = require('stream').promises;
import * as mmm from 'mmmagic';
import { join } from 'path';
import { TryCatchWrapper } from './error-handling/try-catch-wrapper';
import { Readable } from 'stream';

const Magic = mmm.Magic;

interface TImageDirectory {
	idFolderPath: string;
	folderType: ['images', 'videos'];
	folderName: ['story', 'profile'];
}

@Injectable()
export class FileStorageService {
	// constructor(){}

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
	async graphqlSaveFileToStorage(
		file: FileUpload,
		fullFilePath: string
	): Promise<void> {
		const streamFile: ReadStream = file.createReadStream();

		const stream2buffer = await this.stream2buffer(streamFile);

		const convertImage2JpegAsBuffer: Buffer = await sharp(stream2buffer)
			.jpeg()
			.toBuffer();

		const buffer2stream = Readable.from(convertImage2JpegAsBuffer);

		const out: WriteStream = createWriteStream(fullFilePath);

		buffer2stream.pipe(out).on('error', (err) => {
			throw new HttpException('Something went wrong', 500);
		});

		finished(out);
	}

	@TryCatchWrapper()
	async isFileExtensionSafe(fileName: string, regex: RegExp): Promise<boolean> {
		const fileExtensionType: boolean = regex.test(fileName);

		return fileExtensionType;
	}

	@TryCatchWrapper()
	async isMimeTypeSafe<T>(
		file: Buffer,
		validFileMimeType: Array<T>
	): Promise<boolean> {
		const magic = new Magic(mmm.MAGIC_MIME_TYPE);

		const bitmap = function (file: Buffer): Promise<any> {
			return new Promise(function (resolve, reject): void {
				magic.detect(
					file,
					function (err: Error, data: string | string[]): void {
						if (err) reject(err);
						else resolve(data);
					}
				);
			});
		};

		const isFileMimeTypeLegit: boolean = validFileMimeType.includes(
			(await bitmap(file)) as T
		);

		return isFileMimeTypeLegit;
	}

	@TryCatchWrapper()
	async makeDirectoryIfDoesNotExist({
		idFolderPath,
		folderType,
		folderName,
	}: TImageDirectory) {
		for (const type of folderType) {
			for (const folder of folderName) {
				const folderPath = join(idFolderPath, type, folder);
				stat(folderPath, (err: any, stats: Stats) => {
					if (err) {
						mkdir(
							folderPath,
							{ recursive: true },
							(err: NodeJS.ErrnoException | null, path: string | undefined) => {
								//
							}
						);
					} else {
						return;
					}
				});
			}
		}
	}

	@TryCatchWrapper()
	async removeDirectoryIfDoesExist(idFolderPath: string) {
		stat(idFolderPath, (err: any, stats: Stats) => {
			if (!err) {
				rm(
					idFolderPath,
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
	async removeFile(fullFilePath: string): Promise<void> {
		unlink(fullFilePath, (): void => {
			return;
		});
	}
}
