import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { environment } from '../environments/environment';
import { UserModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { join } from 'path';
import { StoryModule } from './story/story.module';
@Module({
	imports: [
		AuthModule,
		UserModule,
		AdminModule,
		StoryModule,
		MongooseModule.forRootAsync({
			connectionName: 'persona',
			useFactory: () => ({
				uri: environment.DATABASE_CONNECTION,
			}),
		}),

		PassportModule.registerAsync({
			useFactory: () => ({ defaultStrategy: 'jwt' }),
		}),

		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			driver: ApolloDriver,
			useFactory: () => ({
				include: [AuthModule, StoryModule],
				typePaths: ['./**/*.graphql'],

				playground: false,
				plugins: [ApolloServerPluginLandingPageLocalDefault()],
				sortSchema: true,
				cors: {
					credentials: true,
					origin: true,
				},
				context: ({ req, res }) => {
					return {
						req,
						res,
					};
				},

				// useGlobalPrefix: true,
			}),
		}),

		// ThrottlerModule.forRootAsync({
		// 	useFactory: () => ({
		// 		ttl: 360,
		// 		limit: 2005,
		// 	}),
		// }),
	],
	controllers: [],
	providers: [
		AppService,
		// {
		// 	provide: APP_GUARD,
		// 	useClass: ThrottlerGuard,
		// },
	],
})
export class AppModule {}
