import { FileUpload } from 'graphql-upload';

export interface IImage {
	fileName: string;
	fullImagePath: string;
	image: FileUpload;
}
