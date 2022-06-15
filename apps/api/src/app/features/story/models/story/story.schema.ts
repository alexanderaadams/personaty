import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types, Document, model } from 'mongoose';

import { User } from '@features/user/models/user/user.schema';
import { InterestAndBioAndCategory } from '@core/models/interest-and-bio-and-category';

export type StoryDocument = Story & Document;

@Schema()
export class Story {
	@Prop({
		type: [{ text: String, color: String }],
		required: true,
	})
	category: Array<InterestAndBioAndCategory>;

	@Prop({
		type: String,
	})
	story_image_url: string;

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
