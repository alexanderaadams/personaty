import { IsArray, IsDate, IsString } from 'class-validator';

import { Category, Story } from '../../../../core/models/graphql.schema';

export class StoryDbModel extends Story {
	@IsString()
	_id: string;

	@IsArray()
	category: Category[];

	@IsString()
	storyImageUrl: string;

	@IsDate()
	created_at: Date;

	@IsString()
	user_id: string;
}
