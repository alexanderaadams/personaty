import { isObject } from '@ngxs/store/src/internal/internals';
import {
	IsAlpha,
	IsEnum,
	IsDateString,
	IsEmail,
	IsString,
	IsDate,
	IsArray,
	IsObject,
} from 'class-validator';
import { User } from '../core/graphql.schema';
import { Gender, Role } from '../core/utilities/models/shared.enum';
import { StoryModel } from '../story/story.model';
import { InterestAndBio } from './entities/interest-and-bio.entity';

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

	@IsEnum(Gender)
	gender: string;

	@IsEnum(Role)
	role: string;

	@IsDate()
	created_at: Date;

	@IsArray()
	stories: StoryModel[];

	@IsObject()
	bio: InterestAndBio;

	@IsArray()
	interests: InterestAndBio[];
}
