import { IsString, IsOptional, IsArray } from 'class-validator';
import { Category, UpdateStoryInput } from '../../core/graphql.schema';

export class UpdateStoryDto extends UpdateStoryInput {
	@IsArray()
	@IsOptional()
	category?: Category[];

	@IsString()
	@IsOptional()
	photo?: string;
}
