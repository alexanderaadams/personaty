import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request } from 'express';

import { environment } from '@environment';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: () => void) {
		const token = req.csrfToken();

		res.cookie('X-CSRF-Token', token, {
			httpOnly: environment.COOKIE_ATTRIBUTE_HTTP_ONLY,
			sameSite: environment.COOKIE_ATTRIBUTE_SAME_SITE,
			secure: environment.COOKIE_ATTRIBUTE_SECURE,
			path: '/',
		});

		res.locals.csrfToken = token;

		next();
	}
}
