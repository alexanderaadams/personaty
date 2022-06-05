// import { Upload, GraphQLUpload } from 'graphql-upload';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import type { Upload } from 'graphql-upload/Upload.js';

export type TImage = Upload | typeof GraphQLUpload;
