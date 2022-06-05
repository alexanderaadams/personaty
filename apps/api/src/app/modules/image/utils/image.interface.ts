// import { FileUpload } from 'graphql-upload';
import type { FileUpload } from 'graphql-upload/processRequest.js';

export interface IImage {
	imageFileName: string;
	fullImagePath: string;
	image: FileUpload;
}
