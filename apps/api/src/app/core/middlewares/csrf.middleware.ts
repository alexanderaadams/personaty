import { Injectable, NestMiddleware } from '@nestjs/common';
import { environment } from '@environment';
import { Response, Request } from 'express';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: () => void) {
		if (environment.production)
			res.cookie('XSRF-TOKEN', req.csrfToken(), {
				httpOnly: environment.COOKIE_ATTRIBUTE_HTTP_ONLY,
				sameSite: environment.COOKIE_ATTRIBUTE_SAME_SITE,
				secure: environment.COOKIE_ATTRIBUTE_SECURE,
				path: '/',
			});

			//

		next();
	}
}
