import {
	DynamicModule,
	MiddlewareConsumer,
	Module,
	NestModule,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { graphqlUploadExpress } from 'graphql-upload';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

import { UserModule } from './features/user/users.module';
import { AuthModule } from './features/auth/auth.module';
import { AdminModule } from './features/admin/admin.module';
import { StoryModule } from './features/story/story.module';
import { environment } from '@environment';

/** Wraps the GraphQLModule with an up-to-date graphql-upload middleware. */
@Module({})
export class GraphQLWithUploadModule implements NestModule {
	async configure(consumer: MiddlewareConsumer) {
		await new Promise((resolve, reject) =>
			resolve(consumer.apply(graphqlUploadExpress()).forRoutes('/graphql'))
		);
	}

	static forRoot(): DynamicModule {
		return {
			module: GraphQLWithUploadModule,
			imports: [
				GraphQLModule.forRootAsync<ApolloDriverConfig>({
					driver: ApolloDriver,
					useFactory: () => ({
						include: [AuthModule, StoryModule, UserModule],
						typePaths: ['./**/*.graphql'],
						sortSchema: true,
						uploads: false,
						playground: environment.production ? false : true,
						// plugins: [ApolloServerPluginLandingPageLocalDefault()],
						bodyParserConfig: true,
						introspection: environment.production ? false : true,
						cors: {
							origin: [environment.HOST_URL, environment.ORIGIN_URL, undefined],
							methods: environment.CORS_HEADERS,
							credentials: true,
						},
						context: ({ req, res }) => {
							return {
								req,
								res,
							};
						},
						formatError: (error: GraphQLError) => {
							const graphQLFormattedError: GraphQLFormattedError = {
								message:
									error.extensions?.exception?.['response']?.message ||
									error.message ||
									'Something went wrong',
							};
							return graphQLFormattedError;
						},
					}),
				}),
			],
		};
	}
}
