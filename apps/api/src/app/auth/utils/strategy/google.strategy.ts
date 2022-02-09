import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { environment } from '../../../../environments/environment';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor() {
		const scopeURL = 'https://www.googleapis.com/auth';
		super({
			clientID: environment.GOOGLE_CLIENT_ID,
			clientSecret: environment.GOOGLE_CLIENT_SECRET,
			callbackURL: environment.GOOGLE_CALLBACK_URL,
			scope: [`${scopeURL}/userinfo.email`, `${scopeURL}/userinfo.profile`],
		});
	}
	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any
	): Promise<any> {
		const { id, displayName, emails, photos, _json } = profile;
		console.log(profile);
		const user = {
			username: `${id}.${Date.now()}`,
			email: emails[0].value || 'email Does Not Exist',
			email_verified: emails[0].value || false,
			locale: _json.locale || 'en',
			fullName: displayName,
			profilePicture: photos[0].value || 'Profile Picture Does Not Exist',
			accessToken: accessToken || 'Access Token Does Not Exist',
			refreshToken: refreshToken || 'Refresh Token Does Not Exist',
		};
		return user;
	}
}
