import { Controller, Head } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Throttle(25, 60)
@Controller()
export class AppController {
	@Head('csrf-token')
	async getCsrfToken() {
		return;
	}
}
