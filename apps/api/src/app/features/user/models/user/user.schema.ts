import { InterestAndBioAndCategory } from '@core/models/interest-and-bio-and-category';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document, Types } from 'mongoose';
import { environment } from '@environment';

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
		min: environment.MIN_LENGTH,
		max: environment.MAX_LENGTH,
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

	@Prop({
		type: String,
		default: '',
	})
	profileCover: string;

	@Prop({ type: String, required: true })
	birthDate: Date;

	@Prop({
		type: Boolean,
		select: false,
		default: false,
	})
	email_verified: boolean;

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

	@Prop({
		type: { text: String, color: String },
	})
	bio: InterestAndBioAndCategory;

	@Prop({ type: [{ text: String, color: String }] })
	interests: Array<InterestAndBioAndCategory>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('stories', {
	ref: 'Story', //The Model to use
	localField: '_id', //Find in Model, where localField
	foreignField: 'user_id', // is equal to foreignField
});

UserSchema.virtual('id').get(function () {
	return this._id;
});

UserSchema.virtual('createdAt').get(function () {
	return this.created_at;
});

// Set Object and Json property to true. Default is set to false
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });
