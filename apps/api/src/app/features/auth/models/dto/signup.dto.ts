import {
	IsDateString,
	MinLength,
	MaxLength,
	IsString,
	IsEmail,
	IsNotEmpty,
} from 'class-validator';

import { Signup_Input } from '@core/models/graphql.schema';
import { environment } from '@environment';

export class SignupDto extends Signup_Input {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@MinLength(environment.MIN_LENGTH)
	@MaxLength(environment.MAX_LENGTH)
	@IsNotEmpty()
	password: string;

	@IsDateString()
	@IsNotEmpty()
	birthDate: string;
}
