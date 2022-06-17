import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { SharedService } from '@persona/shared';

@Injectable()
export class ProgressInterceptor implements HttpInterceptor {
	constructor(private sharedService: SharedService) {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		return next.handle(request).pipe(
			catchError((error) => {
				this.sharedService.executingLoader$.next(false);
				return error;
			}),
			tap((response: any) => {
				if (response instanceof HttpResponse)
					this.sharedService.executingLoader$.next(false);
			})
		);
	}
}
