import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class JWTService {
	constructor(private jwtService: JwtService) {}

	signToken(payload: object, options?: JwtSignOptions) {
		try {
			if (options) return this.jwtService.signAsync(payload, options);

			return this.jwtService.signAsync(payload);
		} catch (err) {
			throw new UnauthorizedException();
		}
	}

	verifyToken(token: string) {
		try {
			return this.jwtService.verifyAsync(token);
		} catch (err) {
			throw new UnauthorizedException();
		}
	}
}
