import {
	IsDateString,
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
} from 'class-validator';
import { Gender } from './shared.enum';

export interface FindUser {
	id?: string;
	username?: string;
	email?: string;
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
	birthDate: string;

	@IsString()
	@IsOptional()
	locale: string;

	@IsString()
	@IsOptional()
	profilePicture: string;
}
