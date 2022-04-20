import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyJWTModule } from '../jwt/jwt.module';
import { User, UserSchema } from '../user/user.schema';
import { UserModule } from '../user/users.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: User.name, schema: UserSchema }],
			'persona'
		),
		UserModule,
		MyJWTModule,
	],
	controllers: [AdminController],
	providers: [AdminService],
})
export class AdminModule {}
