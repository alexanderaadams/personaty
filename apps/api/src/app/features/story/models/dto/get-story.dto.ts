import { IsString } from 'class-validator';

import { GetStoryInput } from '@core/models/graphql.schema';

export class GetStoryDto extends GetStoryInput {
	@IsString()
	id: string;
}
