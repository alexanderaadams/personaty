import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpResponse,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { FormService } from '@persona/authentication';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
	constructor(
		private cookieService: CookieService,
		private formService: FormService
	) {}

	isBrowser: boolean = this.formService.isBrowser;

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
