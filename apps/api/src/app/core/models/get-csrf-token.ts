import { IsBoolean } from 'class-validator';

export class GetCsrfToken {
	@IsBoolean()
	status: boolean;
}
