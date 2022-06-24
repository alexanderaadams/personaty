import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, take } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

import { environment } from '@persona/shared';

@Injectable({
	providedIn: 'root',
})
export class AppService {
	constructor(private http: HttpClient) {}

	getCsrfToken(): void {
		this.http
			.head(
				`${environment.BACKEND_URL}/${environment.BACKEND_BASE_URL}/csrf-token`,
				{
					withCredentials: true,
				}
			)
			.pipe(
				catchError(() => {
					return EMPTY;
				}),
				take(1),
				retry(1)
			)
			.subscribe();
	}
}
