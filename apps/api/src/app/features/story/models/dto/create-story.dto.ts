import { IsArray } from 'class-validator';

import { CreateStoryInput } from '@core/models/graphql.schema';
import { Category } from '../category';

export class CreateStoryDto extends CreateStoryInput {
	@IsArray()
	category: Category[];
}
