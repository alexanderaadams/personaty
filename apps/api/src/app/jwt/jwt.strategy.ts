import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PUB_KEY } from '@march/keys';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: PUB_KEY,
			issuer: 'March Inc.',
			audience: 'www.march.com',
			algorithms: ['RS256', 'RS512'],
		});
	}

	async validate(payload: any) {
		return { username: payload.username };
	}
}
