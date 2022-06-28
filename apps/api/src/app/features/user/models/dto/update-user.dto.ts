import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsDateString,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
	ValidateNested,
} from 'class-validator';

import { EGender } from '@core/enums/gender.enum';
import { Update_User_Input } from '@core/models/graphql.schema';
import { environment } from '@environment';
import { InterestAndBioAndCategory } from '@core/models/interest-and-bio-and-category';
import { Type } from 'class-transformer';

export class UpdateUserDto extends Update_User_Input {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	username?: string;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	fullName?: string;

	@IsEmail()
	@IsNotEmpty()
	@IsOptional()
	email?: string;

	@MinLength(environment.MIN_LENGTH)
	@MaxLength(environment.MAX_LENGTH)
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	password?: string;

	@IsEnum(EGender)
	@IsNotEmpty()
	@IsOptional()
	gender?: string;

	@IsDateString()
	@IsNotEmpty()
	@IsOptional()
	birthDate?: Date;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	locale?: string;

	@IsObject()
	@IsNotEmpty()
	@IsOptional()
	bio?: { text: string; color: string };

	@IsArray()
	@ValidateNested({ each: true, always: true })
	@ArrayMinSize(1)
	@ArrayMaxSize(25)
	@Type(() => InterestAndBioAndCategory)
	@IsNotEmpty()
	@IsOptional()
	interests: Array<InterestAndBioAndCategory>;
}
