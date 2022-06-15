import { IsString, IsNotEmpty } from 'class-validator';

import { User_Status } from '@core/models/graphql.schema';

export class UserStatus extends User_Status {
	@IsString()
	@IsNotEmpty()
	status: string;
}
