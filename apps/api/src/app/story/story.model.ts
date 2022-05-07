import { IsArray, IsDate, IsString } from 'class-validator';
import { Story } from '../core/graphql.schema';
import { Category } from './entities/category.entity';

export class StoryModel extends Story {
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
