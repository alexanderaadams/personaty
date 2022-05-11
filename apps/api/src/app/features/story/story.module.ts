import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '@features/user/users.module';
import { DateScalar } from '@core/utils/graphql-data-scalar/date.scalar';
import { UserDbSchema } from '@features/user/models/user-db/user-db.schema';
import { MyJWTModule } from '@modules/jwt/jwt.module';
import { ImageService } from '@core/utils/image/image.service';

import { StoryDbSchema } from './models/story-db/story-db.schema';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';

@Module({
	imports: [
		UserModule,
		MyJWTModule,
		MongooseModule.forFeature(
			[
				{ name: 'Story', schema: StoryDbSchema },
				{ name: 'User', schema: UserDbSchema },
			],
			'persona'
		),
	],
	providers: [StoryResolver, StoryService, DateScalar, ImageService],
})
export class StoryModule {}
