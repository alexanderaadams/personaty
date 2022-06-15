import { User } from '@core/models/graphql.schema';
import { environment } from '@environment';
import {
	Story,
	StoryDocument,
} from '@features/story/models/story/story.schema';
import { UserDocument } from '@features/user/models/user/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class InjectedMongooseModelsService {
	constructor(
		@InjectModel(User.name, environment.DATABASE_CONNECTION_NAME)
		public readonly userModel: Model<UserDocument>,
		@InjectModel(Story.name, environment.DATABASE_CONNECTION_NAME)
		public readonly storyModel: Model<StoryDocument>
	) {}
}
