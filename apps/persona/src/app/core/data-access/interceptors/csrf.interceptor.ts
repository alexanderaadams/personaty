import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from '@persona/shared';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
	constructor(
		private cookieService: CookieService,
		private sharedService: SharedService
	) {}

	isBrowser: boolean = this.sharedService.isBrowser;

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		let CsrfTokenValue = '';

		if (this.isBrowser) {
			CsrfTokenValue = this.cookieService.get('X-CSRF-Token');

			const updateCsrfRequest = request.clone({
				setHeaders: { 'X-CSRF-Token': CsrfTokenValue },
			});

			return next.handle(updateCsrfRequest);
		} else {
			return next.handle(request);
		}
	}
}
