import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { environment } from '../environments/environment';
import { UserModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { StoryModule } from './story/story.module';
import { ImageModule } from './image/image.module';
import { AllExceptionsFilter } from './all-exceptions.filter';

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
				include: [AuthModule, StoryModule, UserModule],
				typePaths: ['./**/*.graphql'],

				// playground: false,
				// plugins: [ApolloServerPluginLandingPageLocalDefault()],
				sortSchema: true,
				cors: {
					origin: [environment.URI_HOST, environment.URI_ORIGIN, undefined],
					credentials: true,
					preflightContinue: true,
					optionsSuccessStatus: 200,
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

		ImageModule,

		ThrottlerModule.forRootAsync({
			useFactory: () => ({
				ttl: 360,
				limit: 2000,
			}),
		}),
	],
	controllers: [],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
	],
})
export class AppModule {}
