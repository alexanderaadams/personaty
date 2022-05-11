import {
	IsDateString,
	MinLength,
	MaxLength,
	IsString,
	IsEmail,
} from 'class-validator';

import { Signup_Input } from '@core/models/graphql.schema';
import { environment } from '@environments/environment';

export class SignupDto extends Signup_Input {
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(environment.MIN_LENGTH)
	@MaxLength(environment.MAX_LENGTH)
	password: string;

	@IsDateString()
	birthDate: string;
}
