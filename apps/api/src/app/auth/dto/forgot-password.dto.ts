import { IsEmail } from 'class-validator';
import { Send_Forgot_Password_Email_Input } from '../../core/graphql.schema';

export class sendForgotPasswordEmailDto extends Send_Forgot_Password_Email_Input {
	@IsEmail()
	email: string;
}
