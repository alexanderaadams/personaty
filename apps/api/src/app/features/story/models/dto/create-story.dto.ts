import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Create_Story_Input } from '@core/models/graphql.schema';
import { InterestAndBioAndCategory } from '@core/models/interest-and-bio-and-category';

export class CreateStoryDto extends Create_Story_Input {
	@IsArray()
	@ValidateNested({ each: true, always: true })
	@ArrayMinSize(1)
	@ArrayMaxSize(25)
	@Type(() => InterestAndBioAndCategory)
	category: Array<InterestAndBioAndCategory>;
}
