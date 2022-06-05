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
import { InterestAndBio } from '../interest-and-bio';
import { Story_Model } from '@features/story/models/story/story-model';

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
	stories: Array<Story_Model>;

	@IsObject()
	bio: InterestAndBio;

	@IsArray()
	interests: Array<InterestAndBio>;
}
