import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '@features/user/users.module';
import { DateScalar } from '@core/utils/graphql-data-scalar/date.scalar';
import { UserSchema, User } from '@features/user/models/user/user.schema';
import { FileStorageService } from '@core/utils/file-storage.service';

import { Story_Schema, Story } from './models/story/story.schema';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { ImageModule } from '@modules/image/image.module';
import { MyJWTModule } from '@modules/jwt/jwt.module';

@Module({
	imports: [
		UserModule,
		MyJWTModule,
		ImageModule,
		MongooseModule.forFeature(
			[
				{ name: Story.name, schema: Story_Schema },
				{ name: User.name, schema: UserSchema },
			],
			'persona'
		),
	],
	providers: [StoryResolver, StoryService, DateScalar, FileStorageService],
	exports: [],
})
export class StoryModule {}
