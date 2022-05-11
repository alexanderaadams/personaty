import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyJWTModule } from '@modules/jwt/jwt.module';
import { User, UserDbSchema } from '@features/user/models/user-db/user-db.schema';
import { UserModule } from '@features/user/users.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: User.name, schema: UserDbSchema }],
			'persona'
		),
		UserModule,
		MyJWTModule,
	],
	controllers: [AdminController],
	providers: [AdminService],
})
export class AdminModule {}
