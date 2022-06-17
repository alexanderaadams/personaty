import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpResponse,
	HttpErrorResponse,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { tap, catchError } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';
import { environment } from '@persona/shared';

@Injectable()
export class XsrfInterceptor implements HttpInterceptor {
	constructor(private cookieService: CookieService) {}

	// isBrowser: BehaviorSubject<boolean> = this.sharedService.isBrowser;

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		const csrfCookieName = 'XSRF-TOKEN';
		const headerName = 'X-CSRF-Token';

		// Skip both non-mutating requests.
		if (request.method === 'GET' || request.method === 'HEAD')
			return next.handle(request).pipe(
				tap((response) => {
					if (response instanceof HttpResponse)
						this.cookieService.set(
							csrfCookieName,
							response.headers.get(headerName) ?? ''
						);
				})
			);

		const CsrfToken: string = this.cookieService.get(csrfCookieName);

		// Be careful not to overwrite an existing header of the same name.
		if (CsrfToken !== null && !request.headers.has(headerName)) {
			request = request.clone({
				headers: request.headers.set(headerName, CsrfToken),
			});
		}
		return next.handle(request).pipe(
			tap((response) => {
				if (response instanceof HttpResponse)
					this.cookieService.set(
						csrfCookieName,
						response.headers.get(headerName) ?? ''
					);
			})
		);
	}
}
