import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { GET_USER_INFO } from './profile.gql.schema';
import { ProfileStateModel } from './store/profile.model';

@Injectable({
	providedIn: 'root',
})
export class ProfileService {
	// BackendUrl = `${environment.BACKEND_URL}/api/v1`;

	constructor(
		private http: HttpClient,

		private apollo: Apollo
	) {}

	getUserInfo(id: string) {
		return this.apollo
			.watchQuery({
				query: GET_USER_INFO,
				variables: {
					id,
				},
				// errorPolicy: 'all',
				context: {
					withCredentials: true,
				},
			})
			.valueChanges.pipe(
				map(({ data }: any) => {
					return data.getUser as ProfileStateModel;
				})
			);
	}
}
