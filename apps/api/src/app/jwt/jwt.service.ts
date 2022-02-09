import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class JWTService {
	constructor(private jwtService: JwtService) {}

	signToken(payload: object, options?: JwtSignOptions) {
		try {
			if (options) return this.jwtService.sign(payload, options);

			return this.jwtService.sign(payload);
		} catch (err) {
			throw new UnauthorizedException();
		}
	}

	verifyToken(token: string) {
		try {
			return this.jwtService.verify(token);
		} catch (err) {
			throw new UnauthorizedException();
		}
	}
}
