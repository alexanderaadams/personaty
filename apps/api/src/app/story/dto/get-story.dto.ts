import { IsString } from 'class-validator';
import { GetStoryInput } from '../../core/graphql.schema';

export class GetStoryDto extends GetStoryInput {
	@IsString()
	id: string;
}
