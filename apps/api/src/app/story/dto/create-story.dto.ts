import { IsArray } from 'class-validator';
import { CreateStoryInput } from '../../core/graphql.schema';
import { Category } from '../entities/category.entity';

export class CreateStoryDto extends CreateStoryInput {
	@IsArray()
	category: Category[];
}
