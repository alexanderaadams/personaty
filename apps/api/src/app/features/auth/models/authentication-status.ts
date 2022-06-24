import { Expose } from 'class-transformer';

import { Authentication_Status } from '@core/models/graphql.schema';
import { IsOptional } from 'class-validator';

export class AuthenticationStatus extends Authentication_Status {
	@Expose()
	status: string;

	@Expose()
	authenticated: boolean | null;

	@Expose()
	@IsOptional()
	userId?: string;
}
