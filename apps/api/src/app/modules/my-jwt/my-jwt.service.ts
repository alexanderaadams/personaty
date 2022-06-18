import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class MyJWTService {
	constructor(private jwtService: JwtService) {}

	@TryCatchWrapper()
	async signToken(payload: object, options?: JwtSignOptions): Promise<string> {

		if (options) return await this.jwtService.signAsync(payload, options);

		return await this.jwtService.signAsync(payload);
	}

	@TryCatchWrapper()
	async verifyToken(authToken: string): Promise<any> {

		return await this.jwtService.verifyAsync(authToken);
	}
}
