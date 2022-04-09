import { IsString } from 'class-validator';
import { Reset_Password_With_JWT_Input } from '../../core/graphql.schema';

export class ResetPasswordWithTokenDto extends Reset_Password_With_JWT_Input {
	@IsString()
	confirmPassword: string;

	@IsString()
	password: string;

	@IsString()
	token: string;
}
