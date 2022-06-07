import { Injectable, NestMiddleware } from '@nestjs/common';
// import { environment } from '@environment';
import { Response, Request } from 'express';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: () => void) {
		// if (environment.production)
		// req.csrfToken();
		res.set('X-CSRF-Token', req.csrfToken());
		// res.cookie('XSRF-TOKEN', req.csrfToken(), {
		// 	sameSite: environment.COOKIE_ATTRIBUTE_SAME_SITE,
		// 	secure: environment.COOKIE_ATTRIBUTE_SECURE,
		// });

		next();
	}
}
