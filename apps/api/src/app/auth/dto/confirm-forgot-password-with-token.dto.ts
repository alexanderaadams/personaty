import {
	IsDateString,
	MinLength,
	MaxLength,
	IsString,
	IsEmail,
} from 'class-validator';
import { environment } from '../../../environments/environment';
import { Confirm_Forgot_Password_Input } from '../../core/graphql.schema';

export class ConfirmForgotPasswordDto extends Confirm_Forgot_Password_Input {
	@IsString()
	confirmPassword: string;

	@IsString()
	@MinLength(environment.MIN_LENGTH)
	@MaxLength(environment.MAX_LENGTH)
	password: string;

	@IsString()
	token: string;
}
