import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	ValidateNested,
} from 'class-validator';

import { CreateStoryInput } from '@core/models/graphql.schema';
import { Category } from '../category';
import { Type } from 'class-transformer';

export class CreateStoryDto extends CreateStoryInput {
	@IsArray()
	@ValidateNested({ each: true, always: true })
	@ArrayMinSize(1)
	@ArrayMaxSize(25)
	@Type(() => Category)
	category: Array<Category>;
}
