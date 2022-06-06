import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DateScalar } from '@core/utils/graphql-data-scalar/date.scalar';
import { UserSchema, User } from '@features/user/models/user/user.schema';
import { FileStorageService } from '@core/utils/file-storage.service';
import { environment } from '@environment';

import { StorySchema, Story } from './models/story/story.schema';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { UserModule } from '@features/user/users.module'
// import { ImageModule } from '@modules/image/image.module';
// import { MyJWTModule } from '@modules/jwt/jwt.module';

@Module({
	imports: [
		MongooseModule.forFeatureAsync(
			[
				{
					name: Story.name,
					useFactory: () => ({ schema: StorySchema }),
				},
			],
			environment.DATABASE_CONNECTION_NAME
		),UserModule
	],
	providers: [StoryResolver, StoryService, DateScalar, FileStorageService],
	exports: [StoryService],
})
export class StoryModule {}
