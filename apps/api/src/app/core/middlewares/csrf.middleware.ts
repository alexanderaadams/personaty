import { Injectable, NestMiddleware } from '@nestjs/common';
import { environment } from '@environment';
import { Response, Request } from 'express';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: () => void) {
		if (environment.production) res.cookie('XSRF-TOKEN', req.csrfToken());

		next();
	}
}
