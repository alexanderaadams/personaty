import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Schema as MongooseSchema, Types, Document, model } from 'mongoose';

import { User } from '../user/user.schema';

export type StoryDocument = Story & Document;

@Schema()
export class Story extends Document {
	@Prop({ type: String, required: true })
	title: string;

	@Prop({ type: String, required: true })
	description: string;

	@Prop({ type: [String], required: true })
	category: string[];

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


