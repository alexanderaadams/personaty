import { IsString } from 'class-validator';
import { Confirm_Forgot_Password_With_JWT_Input } from '../../core/graphql.schema';

export class ConfirmForgotPasswordWithTokenDto extends Confirm_Forgot_Password_With_JWT_Input {
	@IsString()
	confirmPassword: string;

	@IsString()
	password: string;

	@IsString()
	token: string;
}
