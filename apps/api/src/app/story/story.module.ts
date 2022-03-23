import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { UserModule } from '../user/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Story, StorySchema } from './story.model';
import { DateScalar } from '../core/date.scalar';
import { User, UserSchema } from '../user/user.model';

@Module({
	imports: [
		UserModule,
		MongooseModule.forFeature(
			[
				{ name: Story.name, schema: StorySchema },
				{ name: User.name, schema: UserSchema },
			],
			'persona'
		),
	],
	providers: [StoryResolver, StoryService, DateScalar],
})
export class StoryModule {}
