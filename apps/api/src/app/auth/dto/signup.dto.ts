import { SignupInput } from '../../core/graphql.schema';
import { IsDateString, IsString, IsEmail } from 'class-validator';

export class SignupDto extends SignupInput {
	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsDateString()
	birthDate: string;
}
