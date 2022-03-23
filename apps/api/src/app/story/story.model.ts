import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { Schema as MongooseSchema, Types, Document } from 'mongoose';
import {
	CreateStoryInput,
	DeleteStoryInput,
	GetStoryInput,
	StoryReturn,
	UpdateStoryInput,
	DeleteStoryReturn,
} from '../core/graphql.schema';
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
	userId: User;

	@Prop({ type: Date, default: Date.now() })
	createdAt: Date;
}

export const StorySchema = SchemaFactory.createForClass(Story);

export class CreateStory extends CreateStoryInput {
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
	createdAt: Date;

	@IsString()
	userId: string;
}

export class DeleteStory extends DeleteStoryInput {
	@IsString()
	id: string;
}

export class Delete extends DeleteStoryReturn {
	@IsString()
	status: string;
}
