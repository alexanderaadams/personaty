import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
	IsDate,
	IsDateString,
	IsEmail,
	IsEnum,
	IsString,
} from 'class-validator';
import * as mongoose from 'mongoose';

import { EmailVerified, Gender, Role } from '../core/shared.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
	@Prop({ type: String, required: true, unique: true })
	username: string;

	@Prop({ type: String, required: true, unique: true })
	email: string;

	@Prop({
		type: String,
		required: true,
		min: 2,
		max: 50,
	})
	password: string;

	@Prop({
		type: String,
		default: 'en',
	})
	locale: string;

	@Prop({
		type: String,
	})
	profilePicture: string;

	@Prop({
		type: String,
	})
	accessToken: string;

	@Prop({
		type: String,
	})
	refreshToken: string;

	@Prop({ type: String, required: true })
	date: Date;

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
			values: ['true', 'false'],
			message: 'Email Verified is either: true, false',
		},
		default: 'false',
	})
	email_verified: string;

	@Prop({
		type: String,
		default: 'user',
		enum: {
			values: ['user', 'admin'],
			message: 'Role is not defined',
		},
	})
	role: string;

	@Prop({ type: Date, default: Date.now() })
	createdAt: Date;

	@Prop({ type: Date, default: Date.now() })
	updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export class UserModel extends mongoose.Document {
	@IsString()
	_id: string;

	@IsString()
	username: string;

	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsString()
	locale: string;

	@IsString()
	profilePicture: string;

	@IsString()
	accessToken: string;

	@IsString()
	refreshToken: string;

	@IsDateString()
	date: Date;

	@IsEnum(Gender)
	gender: ['male', 'female', 'other'];

	@IsEnum(EmailVerified)
	email_verified: ['true', 'false'];

	@IsEnum(Role)
	role: string;

	@IsDate()
	createdAt: Date;

	@IsDate()
	updatedAt: Date;
}
