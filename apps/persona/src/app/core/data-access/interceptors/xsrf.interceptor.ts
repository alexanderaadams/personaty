import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable()
export class XsrfInterceptor implements HttpInterceptor {
	constructor(private cookieService: CookieService) {}

	// isBrowser: BehaviorSubject<boolean> = this.sharedService.isBrowser;

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		const cookieName = 'XSRF-TOKEN';
		const headerName = 'X-CSRF-Token';

		// Skip both non-mutating requests.
		if (request.method === 'GET' || request.method === 'HEAD') {
			return next.handle(request);
		}
		const CsrfToken: string = this.cookieService.get(cookieName);

		// Be careful not to overwrite an existing header of the same name.
		if (CsrfToken !== null && !request.headers.has(headerName)) {
			request = request.clone({
				headers: request.headers.set(headerName, CsrfToken),
			});
		}
		return next.handle(request);
	}
}
