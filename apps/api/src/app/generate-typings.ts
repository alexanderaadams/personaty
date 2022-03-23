import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
	typePaths: ['./**/**/*.graphql'],

	path: join(
		process.cwd(),
		'apps',
		'api',
		'src',
		'app',
		'core',
		'graphql.schema.ts'
	),
	outputAs: 'class',
});
