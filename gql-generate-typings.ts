import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
	typePaths: [__dirname + '/apps/api/src/app/**/*.graphql'],
	path: join(
		process.cwd(),
		'apps',
		'api',
		'src',
		'app',
		'core',
		'models',
		'graphql.schema.ts'
	),
	outputAs: 'class',
	watch: true,
});
