import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { GetCsrfToken } from './core/models/get-csrf-token';

@Throttle(25, 60)
@Controller()
export class AppController {
	@Get('csrf-token')
	async getCsrfToken(): Promise<GetCsrfToken> {
		return new Promise<GetCsrfToken>((resolve: any, reject: unknown) => {
			return resolve({ status: true });
		});
	}
}
