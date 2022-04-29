import { IsString } from 'class-validator';
import { Confirm_Forgot_Password_Input } from '../../core/graphql.schema';

export class ConfirmForgotPasswordDto extends Confirm_Forgot_Password_Input {
	@IsString()
	confirmPassword: string;

	@IsString()
	password: string;

	@IsString()
	token: string;
}
