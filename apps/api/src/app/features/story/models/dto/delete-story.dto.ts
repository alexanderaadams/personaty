import { IsString } from 'class-validator';

import { Delete_Story_Input } from '@core/models/graphql.schema';

export class DeleteStoryDto extends Delete_Story_Input {
	@IsString()
	id: string;
}
