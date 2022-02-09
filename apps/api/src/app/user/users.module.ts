import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './user.model';
import { JWTModule } from '../jwt/jwt.module';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: User.name, schema: UserSchema }],
			'persona'
		),
		JWTModule,
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UsersModule {}
