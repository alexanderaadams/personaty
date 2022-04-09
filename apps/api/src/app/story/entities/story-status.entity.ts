import { IsString } from 'class-validator';
import { Story_Status } from '../../core/graphql.schema';

export class StoryStatus extends Story_Status {
	@IsString()
	status: string;
}
