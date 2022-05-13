import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types, Document, model } from 'mongoose';

import { User } from '@features/user/models/user-db/user-db.schema';
import { Category } from '../category';

export type StoryDocument = Story & Document;

@Schema()
export class Story extends Document {
	@Prop({
		type: { text: String, color: String },
		default: { text: '', color: '#fff' },
		required: true,
	})
	category: Category[];

	@Prop({
		type: String,
	})
	cover_image: string;

	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'User',
		required: true,
	})
	user_id: User;

	@Prop({ type: Date, default: Date.now() })
	created_at: Date;
}

export const StoryDbSchema = SchemaFactory.createForClass(Story);
