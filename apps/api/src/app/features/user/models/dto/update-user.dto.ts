import {
	IsArray,
	IsDateString,
	IsEmail,
	IsEnum,
	IsObject,
	IsOptional,
	IsString,
} from 'class-validator';

import { Gender } from '@core/enums/gender.enum';
import { UpdateUserInput } from '@core/models/graphql.schema';

export class UpdateUserDto extends UpdateUserInput {
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

	@IsObject()
	@IsOptional()
	bio?: { text: string; color: string };

	@IsArray()
	@IsOptional()
	tags?: { text: string; color: string }[];
}
