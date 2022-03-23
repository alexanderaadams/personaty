import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mmm = require('mmmagic'),
	Magic = mmm.Magic;

type validFileExtensions = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtensions[] = ['png', 'jpg', 'jpeg'];
const validMimeType: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

export const saveImageToStorage = {
	storage: diskStorage({
		destination: 'upload',
		filename: (req, file, cb) => {
			const fileExtension: string = path.extname(file.originalname);
			const fileName: string = uuidv4() + fileExtension;

			console.log(file);
			cb(null, fileName);
		},
	}),
	fileFilter: (req, file, cb) => {
		const allowedMimeTypes: validMimeType[] = validMimeType;
		allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
	},
};

export const isFileExtensionSafe = async (fullFilePath: string) => {
	console.log(fullFilePath);
	const myRegex = /.(jpe?g|png)$/gi;
	const fileExtensionType = myRegex.test(fullFilePath);

	if (!fileExtensionType) return false;

	const magic = new Magic(mmm.MAGIC_MIME_TYPE);

	const bitmap = function (fullFilePath) {
		return new Promise(function (resolve, reject) {
			magic.detectFile(fullFilePath, function (err, data) {
				if (err) reject(err);
				else resolve(data);
			});
		});
	};

	const isMimeTypeLegit = validMimeType.includes(
		(await bitmap(fullFilePath)) as any
	);

	return fileExtensionType && isMimeTypeLegit;
};

export const removeFile = (fullFilePath: string): void => {
	try {
		fs.unlink(fullFilePath, () => {
			return;
		});
	} catch (err) {
		console.log(err);
	}
};
