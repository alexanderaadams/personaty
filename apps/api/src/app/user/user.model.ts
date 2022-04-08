import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
	IsAlpha,
	IsArray,
	IsDate,
	IsDateString,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';
import { Schema as MongooseSchema, Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

import { Story, StoryModel } from '../story/story.model';

import {
	UserReturn,
	UpdateUserInput,
	StatusReturn,
} from '../core/graphql.schema';

import { Gender, Role } from '../core/shared.enum';

// export type UserDocument = User & Document;

@Schema()
export class User extends Document {
	// @Prop({ type: Types.ObjectId, unique: true })
	// _id: Types.ObjectId;

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
}

export const UserSchema = SchemaFactory.createForClass(User);

export default mongoose.model('User', UserSchema);

UserSchema.virtual('stories', {
	ref: 'Story', //The Model to use
	localField: '_id', //Find in Model, where localField
	foreignField: 'user_id', // is equal to foreignField
});

// Set Object and Json property to true. Default is set to false
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

export class UserModel extends UserReturn {
	@IsString()
	_id: string;

	@IsString()
	fullName: string;

	@IsAlpha()
	username: string;

	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsString()
	locale: string;

	@IsString()
	profilePicture: string;

	@IsDateString()
	birthDate: string;

	@IsEnum(Gender)
	gender: string;

	@IsEnum(Role)
	role: string;

	@IsDate()
	created_at: Date;

	@IsArray()
	stories: StoryModel[];
}

export class UserExtraInfo {
	@IsString()
	_id: string;

	@IsEnum(Role)
	role: 'admin' | 'user';

	@IsString()
	password: string;
}

export class UpdateUser extends UpdateUserInput {
	@IsString()
	@IsOptional()
	username?: string;

	@IsString()
	@IsOptional()
	fullName?: string;

	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	@IsOptional()
	password?: string;

	@IsEnum(Gender)
	@IsOptional()
	gender?: string;

	@IsDateString()
	@IsOptional()
	birthDate?: Date;

	@IsString()
	@IsOptional()
	locale?: string;

	@IsString()
	@IsOptional()
	profilePicture?: string;
}
export class Status extends StatusReturn {
	@IsString()
	status: string;
}
