import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { UserModule } from '../user/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StorySchema } from './story.schema';
import { DateScalar } from '../core/date.scalar';
import { UserSchema } from '../user/user.schema';

@Module({
	imports: [
		UserModule,
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
