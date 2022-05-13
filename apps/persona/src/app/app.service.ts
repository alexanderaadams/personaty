import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { environment } from '@persona/shared';
import { CsrfTokenModel } from './core/data-access/store/app.model';

@Injectable({
	providedIn: 'root',
})
export class AppService {
	constructor(private http: HttpClient) {}

	checkConnection() {
		return this.http
			.get(
				`${environment.BACKEND_URL}/${environment.BACKEND_BASE_URL}/csrf-token`,
				{
					withCredentials: true,
				}
			)
			.pipe(
				map(({ data }: any) => {
					return data.status as CsrfTokenModel;
				})
			);
	}
}
