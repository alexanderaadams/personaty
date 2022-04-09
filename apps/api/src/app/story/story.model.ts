import { IsDate, IsString } from 'class-validator';
import { Story } from '../core/graphql.schema';

export class StoryModel extends Story {
	@IsString()
	_id: string;

	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsString()
	photo: string;

	@IsDate()
	created_at: Date;

	@IsString()
	user_id: string;
}
