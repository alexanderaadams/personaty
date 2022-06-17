import {
	IsEnum,
	IsDateString,
	IsEmail,
	IsString,
	IsDate,
	IsArray,
	IsObject,
	IsOptional,
	ArrayMaxSize,
	ArrayMinSize,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ERole } from '@core/enums/role.enum';
import { EGender } from '@core/enums/gender.enum';
import { User } from '@core/models/graphql.schema';
import { StoryModel } from '@features/story/models/story/story-model';
import { InterestAndBioAndCategory } from '@core/models/interest-and-bio-and-category';

export class UserModel extends User {
	@IsString()
	@IsOptional()
	googleId?: string;

	@IsString()
	_id: string;

	@IsString()
	@IsOptional()
	fullName?: string;

	@IsString()
	@IsOptional()
	username?: string;

	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsString()
	locale: string;

	@IsString()
	@IsOptional()
	profilePicture?: string;

	@IsString()
	@IsOptional()
	profileCover?: string;

	@IsDateString()
	birthDate: string;

	@IsEnum(EGender)
	gender: string;

	@IsEnum(ERole)
	role: string;

	@IsDate()
	created_at: Date;

	@IsArray()
	@IsOptional()
	stories?: Array<StoryModel>;

	@IsObject()
	bio: InterestAndBioAndCategory;

	@IsArray()
	@ValidateNested({ each: true, always: true })
	@ArrayMinSize(2)
	@ArrayMaxSize(25)
	@Type((): typeof InterestAndBioAndCategory => InterestAndBioAndCategory)
	interests: Array<InterestAndBioAndCategory>;
}
