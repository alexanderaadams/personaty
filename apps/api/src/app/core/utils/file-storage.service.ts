import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { FileUpload } from 'graphql-upload';
import { finished } from 'stream/promises';
import * as mmm from 'mmmagic';
import { join } from 'path';
import { TryCatchWrapper } from './error-handling/try-catch-wrapper';

const Magic = mmm.Magic;

interface TImageDirectory {
	idFolderPath: string;
	folderType: ['images', 'videos'];
	folderName: ['story', 'profile'];
}

@Injectable()
export class FileStorageService {

	@TryCatchWrapper()
	async graphqlSaveFileToStorage(
		file: FileUpload,
		fullFilePath: string
	): Promise<void> {
		new Promise((resolve, reject) => {
			const storedFile: ReadStream = file.createReadStream();

			const out: WriteStream = createWriteStream(fullFilePath);

			storedFile.pipe(out).on('error', (err) => {
				reject(err);
				throw new HttpException('Something went wrong', 500);
			});

			finished(out);
			resolve(out);
		});
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
								(
									err: NodeJS.ErrnoException | null,
									path: string | undefined
								) => {
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
