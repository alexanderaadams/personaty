import { Expose } from 'class-transformer';
import {
	IsBoolean,
	IsDateString,
	IsEmail,
	IsString,
	Min,
} from 'class-validator';
import {
	AvailableReturn,
	ForgotPasswordInput,
	LoginInput,
	ResetPasswordTokenInput,
	SignupInput,
	StatusReturn,
} from '../core/graphql.schema';
import { UserInfo } from '../core/shared.model';

export class GoogleOauth2 {
	@IsString()
	_id: string;

	@IsString()
	googleId: string;

	@IsString()
	username: string;

	@IsString()
	email: string;

	@IsString()
	locale: string;

	@IsString()
	fullName: string;

	@IsString()
	profilePicture: string;

	@IsBoolean()
	email_verified: boolean;

	@IsString()
	accessToken: string;

	@IsString()
	refreshToken: string;
}

export class Login extends LoginInput {
	@IsString()
	email: string;

	@IsString()
	password: string;
}

export class Signup extends SignupInput {
	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsDateString()
	birthDate: string;
}

export class ForgotPassword extends ForgotPasswordInput {
	@IsEmail()
	email: string;
}

export class ResetPasswordToken extends ResetPasswordTokenInput {
	@IsString()
	confirmPassword: string;

	@IsString()
	password: string;

	@IsString()
	token: string;
}

export class Status extends StatusReturn {
	@Expose()
	status: string;

	@Expose()
	authenticated: boolean;
}
export class Available extends AvailableReturn {
	@IsBoolean()
	available: boolean;
}
