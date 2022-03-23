import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
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

import { Story } from '../story/story.model';
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

	@Prop({ type: String, unique: true, select: false })
	googleId: string;

	@Prop({ type: String, default: '' })
	fullName: string;

	@Prop({ type: String, unique: true })
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

	@Prop([
		{
			type: MongooseSchema.Types.ObjectId,
			ref: 'Story',
			default: [],
		},
	])
	stories: Story[];

	@Prop({
		type: String,
		select: false,
	})
	accessToken: string;

	@Prop({
		type: String,
		select: false,
	})
	refreshToken: string;

	@Prop({ type: String, required: true })
	birthDate: Date;

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
			values: ['user', 'admin'],
			message: 'Role is not defined',
		},
		default: 'user',
	})
	role: string;

	@Prop({ type: Date, default: Date.now() })
	createdAt: Date;

	@Prop({ type: Date, default: Date.now(), select: false })
	updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export class UserModel extends UserReturn {
	@IsString()
	_id: string;

	@IsString()
	fullName: string;

	@IsString()
	username: string;

	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsString()
	locale: string;

	@IsArray()
	stories: string[];

	@IsString()
	profilePicture: string;

	@IsDateString()
	birthDate: string;

	@IsEnum(Gender)
	gender: string;

	@IsEnum(Role)
	role: string;

	@IsDate()
	createdAt: Date;
}

export class UserExtraInfo {
	@IsString()
	_id: any;

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
