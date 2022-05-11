import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class MyJWTService {
	constructor(private jwtService: JwtService) {}

	async signToken(payload: object, options?: JwtSignOptions) {
		try {
			if (options) return this.jwtService.signAsync(payload, options);

			return await this.jwtService.signAsync(payload);
		} catch (err) {
			throw new UnauthorizedException();
		}
	}

	async verifyToken(token: string) {
		try {
			return await this.jwtService.verifyAsync(token);
		} catch (err) {
			throw new UnauthorizedException();
		}
	}
}
