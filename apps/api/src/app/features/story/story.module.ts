import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '@features/user/users.module';
import { DateScalar } from '@core/utils/graphql-data-scalar/date.scalar';
import { UserSchema } from '@features/user/models/user/user.schema';
import { MyJWTModule } from '@modules/jwt/jwt.module';
import { ImageModule } from '@modules/image/image.module';

import { StorySchema } from './models/story/story.schema';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';

@Module({
	imports: [
		UserModule,
		MyJWTModule,
		ImageModule,
		MongooseModule.forFeature(
			[
				{ name: 'Story', schema: StorySchema },
				{ name: 'User', schema: UserSchema },
			],
			'persona'
		),
	],
	providers: [StoryResolver, StoryService, DateScalar],
})
export class StoryModule {}
