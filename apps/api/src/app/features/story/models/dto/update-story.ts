import {
	IsOptional,
	IsArray,
	ArrayMaxSize,
	ArrayMinSize,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer'

import { Category, UpdateStoryInput } from '@core/models/graphql.schema';

export class UpdateStoryDto extends UpdateStoryInput {
	@IsArray()
	@ValidateNested({ each: true, always: true })
	@ArrayMinSize(1)
	@ArrayMaxSize(25)
	@Type(() => Category)
	@IsOptional()
	category: Array<Category>;
}
