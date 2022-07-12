import {
	IsDateString,
	IsEmail,
	IsString,
	IsDate,
	IsArray,
	IsObject,
	IsOptional,
	ArrayMaxSize,
	IsNotEmpty,
	IsEnum,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ERole } from '@core/enums/role.enum';
import { ESex } from '@core/enums/sex.enum';
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

	@IsEnum(ESex)
	@IsNotEmpty()
	sex: string;

	@IsString()
	@IsOptional()
	profilePicture?: string;

	@IsString()
	@IsOptional()
	profileCover?: string;

	@IsDateString()
	@IsNotEmpty()
	birthDate: string;

	@IsEnum(ERole)
	@IsNotEmpty()
	role: string;

	@IsDate()
	@IsNotEmpty()
	createdAt: Date;

	@IsArray()
	stories: Array<StoryModel>;

	@IsObject()
	@Type((): typeof InterestAndBioAndCategory => InterestAndBioAndCategory)
	bio: InterestAndBioAndCategory;

	@IsArray()
	@ValidateNested({ each: true, always: true })
	@ArrayMaxSize(25)
	@Type((): typeof InterestAndBioAndCategory => InterestAndBioAndCategory)
	interests: Array<InterestAndBioAndCategory>;
}
