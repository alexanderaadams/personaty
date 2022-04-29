import { Signup_Input } from '../../core/graphql.schema';
import { IsDateString, IsString, IsEmail } from 'class-validator';

export class SignupDto extends Signup_Input {
	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsDateString()
	birthDate: string;
}
