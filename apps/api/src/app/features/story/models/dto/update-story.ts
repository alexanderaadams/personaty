import {
	IsOptional,
	IsArray,
	ArrayMaxSize,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Update_Story_Input } from '@core/models/graphql.schema';
import { InterestAndBioAndCategory } from '@core/models/interest-and-bio-and-category';

export class UpdateStoryDto extends Update_Story_Input {
	@IsArray()
	@ValidateNested({ each: true, always: true })
	@ArrayMaxSize(25)
	@Type(() => InterestAndBioAndCategory)
	@IsOptional()
	category: Array<InterestAndBioAndCategory>;
}
