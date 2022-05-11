import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PUB_KEY } from '@persona/keys';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: PUB_KEY,
			issuer: 'Persona Inc.',
			audience: 'www.persona.com',
			algorithms: ['RS256', 'RS512'],
		});
	}

	async validate(payload: Record<string, unknown>) {
		return { username: payload.username };
	}
}
