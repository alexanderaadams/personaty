import { MinLength, MaxLength, IsString } from 'class-validator';

import { environment } from '@environment';
import { Confirm_Forgot_Password_Input } from '@core/models/graphql.schema';

export class ConfirmForgotPasswordDto extends Confirm_Forgot_Password_Input {
	@IsString()
	@MinLength(environment.MIN_LENGTH)
	@MaxLength(environment.MAX_LENGTH)
	password: string;

	@IsString()
	@MinLength(environment.MIN_LENGTH)
	@MaxLength(environment.MAX_LENGTH)
	confirmPassword: string;

	@IsString()
	authToken: string;
}
