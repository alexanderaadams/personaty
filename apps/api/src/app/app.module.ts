import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { environment } from '../environments/environment';
import { UserModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { StoryModule } from './story/story.module';
import { GraphQLWithUploadModule } from './graphql-with-upload.module';
import { UploadScalar } from './core/graphql-data-scalar/upload.scalar';
import { DateScalar } from './core/graphql-data-scalar/date.scalar';

// import { AllExceptionsFilter } from './all-exceptions.filter';

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

		GraphQLWithUploadModule.forRoot(),

		ThrottlerModule.forRootAsync({
			useFactory: () => ({
				ttl: 60,
				limit: 100,
			}),
		}),
	],
	providers: [UploadScalar, DateScalar],
})
export class AppModule {}
