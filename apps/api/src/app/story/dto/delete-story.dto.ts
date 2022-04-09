import { IsString } from 'class-validator';
import { DeleteStoryInput } from '../../core/graphql.schema';

export class DeleteStoryDto extends DeleteStoryInput {
	@IsString()
	id: string;
}
