import { IsArray, IsDate, IsString } from 'class-validator';
import { Story } from '../core/graphql.schema';

export class StoryModel extends Story {
	@IsString()
	_id: string;

	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsArray()
	category: string[];

	// @IsString()
	// cover_image: string;

	@IsDate()
	created_at: Date;

	@IsString()
	user_id: string;
}
