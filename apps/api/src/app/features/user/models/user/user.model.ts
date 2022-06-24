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
	IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ERole } from '@core/enums/role.enum';
import { EGender } from '@core/enums/gender.enum';
import { User } from '@core/models/graphql.schema';
import { StoryModel } from '@features/story/models/story/story-model';
import { InterestAndBioAndCategory } from '@core/models/interest-and-bio-and-category';

export class UserModel extends User {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	googleId?: string;

	@IsString()
	@IsNotEmpty()
	id: string;

	@IsString()
	@IsOptional()
	fullName?: string;

	@IsString()
	@IsOptional()
	username?: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsNotEmpty()
	locale: string;

	@IsString()
	@IsOptional()
	profilePicture?: string;

	@IsString()
	@IsOptional()
	profileCover?: string;

	@IsDateString()
	@IsNotEmpty()
	birthDate: string;

	@IsEnum(EGender)
	@IsNotEmpty()
	gender: string;

	@IsEnum(ERole)
	@IsNotEmpty()
	role: string;

	@IsDate()
	@IsNotEmpty()
	createdAt: Date;

	@IsArray()
	stories: Array<StoryModel>;

	@IsObject()
	bio: InterestAndBioAndCategory;

	@IsArray()
	@ValidateNested({ each: true, always: true })
	@ArrayMinSize(2)
	@ArrayMaxSize(25)
	@Type((): typeof InterestAndBioAndCategory => InterestAndBioAndCategory)
	interests: Array<InterestAndBioAndCategory>;
}
