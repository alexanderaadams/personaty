import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsDateString,
	IsEmail,
	IsEnum,
	IsObject,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
	ValidateNested,
} from 'class-validator';

import { ESex } from '@core/enums/sex.enum';
import { Update_User_Input } from '@core/models/graphql.schema';
import { environment } from '@environment';
import { InterestAndBioAndCategory } from '@core/models/interest-and-bio-and-category';
import { Type } from 'class-transformer';

export class UpdateUserDto extends Update_User_Input {
	@IsString()
	@IsOptional()
	username?: string;

	@IsString()
	@IsOptional()
	fullName?: string;

	@IsEmail()
	@IsOptional()
	email?: string;

	@MinLength(environment.MIN_LENGTH)
	@MaxLength(environment.MAX_LENGTH)
	@IsString()
	@IsOptional()
	password?: string;

	@IsEnum(ESex)
	@IsOptional()
	gender?: string;

	@IsDateString()
	@IsOptional()
	birthDate?: Date;

	@IsString()
	@IsOptional()
	locale?: string;

	@IsObject()
	@IsOptional()
	bio?: { text: string; color: string };

	@IsArray()
	@ValidateNested({ each: true, always: true })
	@ArrayMaxSize(25)
	@Type(() => InterestAndBioAndCategory)
	@IsOptional()
	interests?: Array<InterestAndBioAndCategory>;
}
