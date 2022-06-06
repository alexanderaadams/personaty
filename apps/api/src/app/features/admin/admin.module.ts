import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@features/user/models/user/user.schema';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: User.name, schema: UserSchema }],
			'persona'
		),
	],
	controllers: [AdminController],
	providers: [AdminService],
})
export class AdminModule {}
