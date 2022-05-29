/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs';

import { GET_USER_INFO } from '../graphql/profile.gql.schema';
import { IProfileStateModel } from '../store/profile.model';

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
			})
			.valueChanges.pipe(
				map(({ data }: any) => {
					return data.getUser as IProfileStateModel;
				})
			);
	}
}
