import {
	IsOptional,
	IsArray,
	ArrayMaxSize,
	ArrayMinSize,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { UpdateStoryInput } from '@core/models/graphql.schema';
import { InterestAndBioAndCategory } from '@core/models/interest-and-bio-and-category';

export class UpdateStoryDto extends UpdateStoryInput {
	@IsArray()
	@ValidateNested({ each: true, always: true })
	@ArrayMinSize(1)
	@ArrayMaxSize(25)
	@Type(() => InterestAndBioAndCategory)
	@IsOptional()
	category: Array<InterestAndBioAndCategory>;
}
