import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class JWTService {
	constructor(private jwtService: JwtService) {}

	signToken(username: string, options?: JwtSignOptions) {
		try {
			// if (options) return this.jwtService.sign({ username }, options);

			return this.jwtService.sign({ username }, options);
		} catch (err) {
			throw new UnauthorizedException();
		}
	}

	verifyToken(jwt: string) {
		try {
			return this.jwtService.verify(jwt);
		} catch (err) {
			throw new UnauthorizedException();
		}
	}
}
