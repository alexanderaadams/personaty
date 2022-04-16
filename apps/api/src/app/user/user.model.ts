import {
	IsAlpha,
	IsEnum,
	IsDateString,
	IsEmail,
	IsString,
	IsDate,
	IsArray,
} from 'class-validator';
import { User } from '../core/graphql.schema';
import { Gender, Role } from '../core/shared.enum';
import { StoryModel } from '../story/story.model';

export class UserModel extends User {
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

	@IsString()
	bio: string;

	@IsArray()
	tags: string[];
}
