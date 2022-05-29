import { HttpException, HttpStatus } from '@nestjs/common';
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

const Magic = mmm.Magic;

export async function GqlSaveFileToStorage(
	file: FileUpload,
	fullFilePath: string
): Promise<void> {
	try {
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
	} catch (err) {
		throw new HttpException(
			err?.message ?? 'Something went wrong',
			err?.statusCode ?? 500
		);
	}
}

export async function isFileExtensionSafe(
	fileName: string,
	regex: RegExp
): Promise<boolean> {
	try {
		const fileExtensionType: boolean = regex.test(fileName);

		return fileExtensionType;
	} catch (err) {
		throw new HttpException('Something went wrong', 500);
	}
}

export async function isMimeTypeSafe<T>(
	file: Buffer,
	validFileMimeType: Array<T>
): Promise<boolean> {
	try {
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
	} catch (err) {
		throw new HttpException('Something went wrong', 500);
	}
}

interface mkdir {
	idFolderPath: string;
	types: ['images', 'videos'];
	folders: ['story', 'profile'];
}

export async function makeDirectoryIfDoesNotExist({
	idFolderPath,
	types,
	folders,
}: mkdir): Promise<void> {
	try {

			for (const type of types) {
				for (const folder of folders) {
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
		});
	} catch (error) {
		throw new HttpException(
			{
				statusCode:
					error?.response?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
				message:
					error?.response?.message ?? error?.message ?? 'Something Went Wrong',
			},
			error?.response?.error ?? HttpStatus.INTERNAL_SERVER_ERROR
		);
	}
}
export async function removeDirectoryIfDoesExist(
	idFolderPath: string
): Promise<void> {
	try {
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
	} catch (error) {
		return;
	}
}

export async function removeFile(fullFilePath: string): Promise<void> {
	try {
		unlink(fullFilePath, (): void => {
			return;
		});
	} catch (error) {
		throw new HttpException(
			{
				statusCode:
					error?.response?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
				message:
					error?.response?.message ?? error?.message ?? 'Something Went Wrong',
			},
			error?.response?.error ?? HttpStatus.INTERNAL_SERVER_ERROR
		);
	}
}
