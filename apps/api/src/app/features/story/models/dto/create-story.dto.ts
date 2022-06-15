import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { CreateStoryInput } from '@core/models/graphql.schema';
import { InterestAndBioAndCategory } from '@core/models/interest-and-bio-and-category';

export class CreateStoryDto extends CreateStoryInput {
	@IsArray()
	@ValidateNested({ each: true, always: true })
	@ArrayMinSize(1)
	@ArrayMaxSize(25)
	@Type(() => InterestAndBioAndCategory)
	category: Array<InterestAndBioAndCategory>;
}
