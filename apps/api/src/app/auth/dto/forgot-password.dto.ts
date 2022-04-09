import { IsEmail } from 'class-validator';
import { ForgotPasswordInput } from '../../core/graphql.schema';

export class ForgotPasswordDto extends ForgotPasswordInput {
	@IsEmail()
	email: string;
}
