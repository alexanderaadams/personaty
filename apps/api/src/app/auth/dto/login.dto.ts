import { IsString } from 'class-validator';
import { LoginInput } from '../../core/graphql.schema';

export class LoginDto extends LoginInput {
	@IsString()
	email: string;

	@IsString()
	password: string;
}
