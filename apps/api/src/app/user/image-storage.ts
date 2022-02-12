// import { diskStorage } from 'multer';
// import { v4 as uuidv4 } from 'uuid';

// // eslint-disable-next-line @typescript-eslint/no-var-requires
// import * as fs from 'fs';
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const fileType = require('file-type');

// import path = require('path');

// type validFileExtensions = 'png' | 'jpg' | 'jpeg';
// type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

// const validFileExtensions: validFileExtensions[] = ['png', 'jpg', 'jpeg'];
// const validMimeType: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

// export const saveImageToStorage = {
// 	storage: diskStorage({
// 		destination: 'upload',
// 		filename: (req, file, cb) => {
// 			const fileExtension: string = path.extname(file.originalname);
// 			const fileName: string = uuidv4() + fileExtension;

// 			cb(null, fileName);
// 		},
// 	}),
// 	fileFilter: (req, file, cb) => {
// 		const allowedMimeTypes: validMimeType[] = validMimeType;
// 		allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
// 	},
// };
// export const isFileExtensionSafe = async (fullFilePath: string) => {
// 	const fileExtensionAndMimeType = (await fileType.fileTypeFromFile(
// 		fullFilePath
// 	)) as {
// 		ext: validFileExtensions;
// 		mime: validMimeType;
// 	};

// 	if (!fileExtensionAndMimeType) return false;

// 	const isFileTypeLegit = validFileExtensions.includes(
// 		fileExtensionAndMimeType.ext
// 	);
// 	const isMimeTypeLegit = validMimeType.includes(fileExtensionAndMimeType.mime);

// 	const isFileLegit = isFileTypeLegit && isMimeTypeLegit;

// 	return isFileLegit;
// };
// export const removeFile = (fullFilePath: string): void => {
// 	try {
// 		fs.unlink(fullFilePath, () => {
// 			return;
// 		});
// 	} catch (err) {
// 		console.log(err);
// 	}
// };
