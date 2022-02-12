import { Expose } from 'class-transformer';
import { IsDateString, IsEmail, IsString } from 'class-validator';

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

	@IsString()
	accessToken: string;

	@IsString()
	refreshToken: string;
}

export class LoginUser {
	@IsString()
	username: string;

	@IsString()
	password: string;
}

export class SignupUser {
	@IsString()
	username: string;

	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsDateString()
	birthDate: string;
}

export class UserSignupResponse {
	@Expose()
	username: string;

	@Expose()
	email: string;
}
