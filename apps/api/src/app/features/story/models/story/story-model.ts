import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsDate,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Story } from '@core/models/graphql.schema';
import { InterestAndBioAndCategory } from '@core/models/interest-and-bio-and-category';

export class StoryModel extends Story {
	@IsString()
	_id: string;

	@IsArray()
	@ValidateNested({ each: true, always: true })
	@ArrayMinSize(2)
	@ArrayMaxSize(25)
	@Type((): typeof InterestAndBioAndCategory => InterestAndBioAndCategory)
	category: Array<InterestAndBioAndCategory>;

	@IsString()
	story_image_url: string;

	@IsDate()
	@IsOptional()
	created_at: Date;

	@IsString()
	user_id: string;
}
