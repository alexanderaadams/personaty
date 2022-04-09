import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
	Schema as MongooseSchema,
	Document,
	Types,
	model,
} from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
	@Prop({ type: String, select: false })
	googleId: string;

	@Prop({ type: String, default: '' })
	fullName: string;

	@Prop({ type: String, default: '' })
	username: string;

	@Prop({ type: String, required: true, unique: true })
	email: string;

	@Prop({
		type: String,
		required: true,
		min: 2,
		max: 50,
		select: false,
	})
	password: string;

	@Prop({
		type: String,
		default: 'en',
	})
	locale: string;

	@Prop({
		type: String,
		default: '',
	})
	profilePicture: string;

	@Prop({ type: String })
	birthDate: Date;

	@Prop({
		type: String,
		select: false,

		enum: {
			values: ['true', 'false'],
			message: 'Email Verified is either: true, false',
		},
		default: 'false',
	})
	email_verified: string;

	@Prop({
		type: String,
		enum: {
			values: ['male', 'female', 'other'],
			message: 'Gender is either: male, female, other',
		},
		default: 'other',
	})
	gender: string;

	@Prop({
		type: String,
		enum: {
			values: ['user', 'admin'],
			message: 'Role is not defined',
		},
		default: 'user',
	})
	role: string;

	@Prop({ type: Date, default: Date.now() })
	created_at: Date;

	@Prop({ type: Date, default: Date.now(), select: false })
	updated_at: Date;

	@Prop({ type: String, default: '' })
	bio: string;

	@Prop({ type: [String], default: [''] })
	tags: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('stories', {
	ref: 'Story', //The Model to use
	localField: '_id', //Find in Model, where localField
	foreignField: 'user_id', // is equal to foreignField
});

// Set Object and Json property to true. Default is set to false
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });
