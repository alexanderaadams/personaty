import { IsString, IsOptional, IsArray } from 'class-validator';

import { Category, UpdateStoryInput } from '@core/models/graphql.schema';

export class UpdateStoryDto extends UpdateStoryInput {
	@IsArray()
	@IsOptional()
	category: Array<Category>;
}
