import { IsString, IsNotEmpty } from 'class-validator';

import { Story_Status } from '@core/models/graphql.schema';

export class StoryStatus extends Story_Status {
	@IsString()
	@IsNotEmpty()
	status: string;
}
