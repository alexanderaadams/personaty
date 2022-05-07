import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { UserModule } from '../user/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StorySchema } from './story.schema';
import { DateScalar } from '../core/graphql-data-scalar/date.scalar';
import { UserSchema } from '../user/user.schema';
import { MyJWTModule } from '../jwt/jwt.module';
import { ImageService } from '../core/utilities/image/image.service';

@Module({
	imports: [
		UserModule,
		MyJWTModule,
		MongooseModule.forFeature(
			[
				{ name: 'Story', schema: StorySchema },
				{ name: 'User', schema: UserSchema },
			],
			'persona'
		),
	],
	providers: [StoryResolver, StoryService, DateScalar, ImageService],
})
export class StoryModule {}
