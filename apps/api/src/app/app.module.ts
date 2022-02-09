import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { environment } from '../environments/environment';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import { PostModule } from './post/post.module';
import { AdminModule } from './admin/admin.module';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			connectionName: 'persona',
			useFactory: () => ({
				uri: environment.DATABASE_CONNECTION,
			}),
		}),

		PassportModule.registerAsync({
			useFactory: () => ({ defaultStrategy: 'jwt' }),
		}),
		ThrottlerModule.forRootAsync({
			useFactory: () => ({
				ttl: 360,
				limit: 25,
			}),
		}),
		AuthModule,
		UsersModule,
		HomeModule,
		PostModule,
		AdminModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
