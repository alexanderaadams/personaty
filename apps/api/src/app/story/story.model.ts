import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDate, IsOptional, IsString } from 'class-validator';
import {
	CreateStoryInput,
	DeleteStoryInput,
	GetStoryInput,
	StoryReturn,
	UpdateStoryInput,
	DeleteStoryReturn,
} from '../core/graphql.schema';

import { Schema as MongooseSchema, Types, Document } from 'mongoose';
import * as mongoose from 'mongoose';

import { User } from '../user/user.model';

// export type StoryDocument = Story & Document;

@Schema()
export class Story extends Document {
	@Prop({ type: String, required: true })
	title: string;

	@Prop({ type: String, required: true })
	description: string;

	@Prop({
		type: String,
		required: true,
	})
	photo: string;

	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'User',
		required: true,
	})
	user_id: User;

	@Prop({ type: Date, default: Date.now() })
	created_at: Date;
}

export const StorySchema = SchemaFactory.createForClass(Story);

export default mongoose.model('Story', StorySchema);

export class CreateStory extends CreateStoryInput {
	@IsString()
	user_id: string;

	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsString()
	photo: string;
}

export class UpdateStory extends UpdateStoryInput {
	@IsString()
	@IsOptional()
	title?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional()
	photo?: string;
}

export class GetStory extends GetStoryInput {
	@IsString()
	id: string;
}

export class StoryModel extends StoryReturn {
	@IsString()
	_id: string;

	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsString()
	photo: string;

	@IsDate()
	created_at: Date;

	@IsString()
	user_id: string;
}

export class DeleteStory extends DeleteStoryInput {
	@IsString()
	id: string;
}

export class Delete extends DeleteStoryReturn {
	@IsString()
	status: string;
}
