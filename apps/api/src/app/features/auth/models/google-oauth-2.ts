import { IsBoolean, IsString, IsNotEmpty } from 'class-validator';

export class GoogleOauth2 {
	@IsString()
	@IsNotEmpty()
	_id: string;

	@IsString()
	@IsNotEmpty()
	googleId: string;

	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	locale: string;

	@IsString()
	@IsNotEmpty()
	fullName: string;

	@IsString()
	@IsNotEmpty()
	profilePicture: string;

	@IsBoolean()
	@IsNotEmpty()
	email_verified: boolean;
}
