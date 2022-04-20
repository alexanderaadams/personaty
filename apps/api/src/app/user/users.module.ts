import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';
import { MyJWTModule } from '../jwt/jwt.module';
import { DateScalar } from '../core/date.scalar';
import { UserResolver } from './user.resolver';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: 'User', schema: UserSchema }],
			'persona'
		),
		MyJWTModule,
	],
	controllers: [UserController],
	providers: [UserService, UserResolver, DateScalar],
	exports: [UserService],
})
export class UserModule {}
