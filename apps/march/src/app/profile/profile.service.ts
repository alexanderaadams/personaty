import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, map } from 'rxjs';
import { CreateStoryDto } from '../story/create-story.dto';
import { GET_USER_INFO } from './profile.gql.schema';
import { ProfileStateModel } from './store/profile.model';

@Injectable({
	providedIn: 'root',
})
export class ProfileService {
	// rootUrl = 'http://localhost:3333/api/v1';
	rootUrl = 'https://api-persona2.herokuapp.com/api/v1';

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
				errorPolicy: 'all',
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
