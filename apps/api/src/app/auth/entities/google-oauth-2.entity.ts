import {
	IsBoolean,
	IsDateString,
	IsEmail,
	IsString,
	Min,
} from 'class-validator';

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
}
