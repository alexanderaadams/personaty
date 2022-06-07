import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';

import { environment, SharedService } from '@persona/shared';
import { CsrfTokenModel } from './core/data-access/store/app.model';

@Injectable({
	providedIn: 'root',
})
export class AppService {
	constructor(
		private http: HttpClient,
		private readonly sharedService: SharedService
	) {}

	checkConnection(): Observable<CsrfTokenModel> {
		return this.http
			.get(
				`${environment.BACKEND_URL}/${environment.BACKEND_BASE_URL}/csrf-token`,
				{
					withCredentials: true,
				}
			)
			.pipe(
				catchError(() => {
					return EMPTY;
				}),
				map(({ data }: any): CsrfTokenModel => {
					this.sharedService.executingLoader$.next(false);
					return data.status as CsrfTokenModel;
				})
			);
	}
}
