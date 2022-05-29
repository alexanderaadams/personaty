import {
	IsEnum,
	IsDateString,
	IsEmail,
	IsString,
	IsDate,
	IsArray,
	IsObject,
} from 'class-validator';

import { ERole } from '@core/enums/role.enum';
import { EGender } from '@core/enums/gender.enum';
import { User } from '@core/models/graphql.schema';
import { StoryDbModel } from '@features/story/models/story-db/story-db.model';
import { InterestAndBio } from '../interest-and-bio';

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

	@IsString()
	profileCover: string;

	@IsDateString()
	birthDate: string;

	@IsEnum(EGender)
	gender: string;

	@IsEnum(ERole)
	role: string;

	@IsDate()
	created_at: Date;

	@IsArray()
	stories: StoryDbModel[];

	@IsObject()
	bio: InterestAndBio;

	@IsArray()
	interests: InterestAndBio[];
}
