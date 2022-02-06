import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import {
	IsDate,
	IsDateString,
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
} from 'class-validator';
import * as mongoose from 'mongoose';

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

export enum Gender {
	male = 'male',
	female = 'female',
	other = 'other',
}

export enum Role {
	user = 'user',
	admin = 'admin',
}

export class LoginUser {
	@IsString()
	username: string;

	@IsString()
	password: string;
}

export class SignupUser {
	@IsString()
	username: string;

	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsDateString()
	date: string;
}

export class UpdateUser {
	@IsString()
	@IsOptional()
	username: string;

	@IsEmail()
	@IsOptional()
	email: string;

	@IsString()
	@IsOptional()
	password: string;

	@IsEnum(Gender)
	@IsOptional()
	Gender: string;

	@IsDateString()
	@IsOptional()
	date: string;

	@IsString()
	@IsOptional()
	locale: string;

	@IsString()
	@IsOptional()
	profilePicture: string;
}

export class UserSignupResponse {
	@Expose()
	username: string;

	@Expose()
	email: string;
}

export interface FindUser {
	_id?: string;
	username?: string;
	email?: string;
}

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

	@IsEnum(Role)
	role: string;

	@IsDate()
	createdAt: Date;

	@IsDate()
	updatedAt: Date;
}

export class GoogleOauth2 {
	@IsString()
	_id: string;

	@IsString()
	username: string;

	@IsString()
	email: string;

	@IsString()
	locale: string;

	@IsString()
	fullName: string;

	@IsString()
	profilePicture: string;

	@IsString()
	accessToken: string;

	@IsString()
	refreshToken: string;
}
