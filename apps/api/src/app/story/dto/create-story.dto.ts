import { IsOptional, IsString, IsArray } from 'class-validator';
import { CreateStoryInput } from '../../core/graphql.schema';
import { Category } from '../entities/category.entity';

export class CreateStoryDto extends CreateStoryInput {
	@IsString()
	user_id: string;

	@IsString()
	title: string;

	@IsString()
	description: string;

	// @IsString()
	// @IsOptional()
	// cover_image?: string;

	@IsArray()
	category: Category[];
}
