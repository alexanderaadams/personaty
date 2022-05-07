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
import { UserModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { StoryModule } from './story/story.module';
import { environment } from '../environments/environment';
import { AppModule } from './app.module';

/** Wraps the GraphQLModule with an up-to-date graphql-upload middleware. */
@Module({})
export class GraphQLWithUploadModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(graphqlUploadExpress()).forRoutes('/graphql');
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

						cors: {
							origin: [environment.HOST_URL, environment.ORIGIN_URL, undefined],
							credentials: true,
						},
						context: ({ req, res }) => {
							return {
								req,
								res,
							};
						},
					}),
				}),
			],
		};
	}
}
