import { IsString } from 'class-validator';
import { Login_Input } from '../../core/graphql.schema';

export class LoginDto extends Login_Input {
	@IsString()
	email: string;

	@IsString()
	password: string;
}
