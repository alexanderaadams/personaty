import { FileUpload } from 'graphql-upload';

export interface IImage {
	imageFileName: string;
	fullImagePath: string;
	image: FileUpload;
}
