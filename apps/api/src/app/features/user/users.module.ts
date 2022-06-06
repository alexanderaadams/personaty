import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DateScalar } from '@core/utils/graphql-data-scalar/date.scalar';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema, User } from './models/user/user.schema';
import { UserResolver } from './user.resolver';
import { environment } from '@environment';

@Module({
	imports: [
		MongooseModule.forFeatureAsync(
			[
				{
					name: User.name,
					useFactory: () => ({ schema: UserSchema }),
				},
			],
			environment.DATABASE_CONNECTION_NAME
		),
	],
	controllers: [UserController],
	providers: [UserService, UserResolver, DateScalar],
	exports: [UserService],
})
export class UserModule {}
