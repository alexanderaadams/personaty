import { Expose } from 'class-transformer';

import { Authentication_Status } from '@core/models/graphql.schema';

export class AuthenticationStatus extends Authentication_Status {
	@Expose()
	status: string;

	@Expose()
	authenticated: boolean;
}
