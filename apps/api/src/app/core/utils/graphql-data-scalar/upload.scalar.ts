import { Scalar } from '@nestjs/graphql';
// import { GraphQLUpload } from 'graphql-upload';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@Scalar('Upload')
export class UploadScalar {
	description = 'File upload scalar type';

	parseValue(value) {
		return GraphQLUpload.parseValue(value);
	}

	serialize(value) {
		return GraphQLUpload.serialize(value);
	}

	parseLiteral(ast) {
		return GraphQLUpload.parseLiteral(ast, ast.value);
	}
}
