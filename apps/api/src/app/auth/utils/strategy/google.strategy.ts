import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
// import { environment } from '../../../environments/environment';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor() {
		super({
			clientID:
				'248176349194-ji6ciaoe6cdp8jcp0b3601npk7ka1guo.apps.googleusercontent.com',
			clientSecret: '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',
			callbackURL: '/api/v1/auth/redirect',
			scope: ['email', 'profile'],
		});
	}
	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile
	): Promise<any> {
		const { id, name, emails, photos, _json } = profile;
		const user = {
			username: `${id}.${Date.now()}`,
			email: emails[0].value || 'email Does Not Exist',
			locale: _json.locale || 'en',
			fullName: `${name.givenName} ${name.middleName} ${name.familyName}`,
			profilePicture: photos[0].value || 'Profile Picture Does Not Exist',
			accessToken: accessToken || 'Access Token Does Not Exist',
			refreshToken: refreshToken || 'Refresh Token Does Not Exist',
		};
		return user;
	}
}
