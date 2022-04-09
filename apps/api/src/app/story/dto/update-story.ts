import { IsString, IsOptional } from 'class-validator';
import { UpdateStoryInput } from '../../core/graphql.schema';

export class UpdateStoryDto extends UpdateStoryInput {
	@IsString()
	@IsOptional()
	title?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional()
	photo?: string;
}
