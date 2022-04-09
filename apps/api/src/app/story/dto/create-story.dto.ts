import { IsString } from 'class-validator';
import { CreateStoryInput } from '../../core/graphql.schema';

export class CreateStoryDto extends CreateStoryInput {
	@IsString()
	user_id: string;

	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsString()
	photo: string;
}
