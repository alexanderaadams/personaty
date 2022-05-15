import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class MyJWTService {
	constructor(private jwtService: JwtService) {}

	async signToken(payload: object, options?: JwtSignOptions) {
		if (options) return this.jwtService.signAsync(payload, options);

		return await this.jwtService.signAsync(payload);
	}

	async verifyToken(authToken: string) {
		return await this.jwtService.verifyAsync(authToken);
	}
}
