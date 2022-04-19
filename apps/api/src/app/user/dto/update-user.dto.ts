import {
	IsArray,
	IsDateString,
	IsEmail,
	IsEnum,
	IsObject,
	IsOptional,
	IsString,
} from 'class-validator';
import { UpdateUserInput } from '../../core/graphql.schema';
import { Gender } from '../../core/shared.enum';

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
