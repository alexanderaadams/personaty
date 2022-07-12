/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, map, Observable } from 'rxjs';

import { GET_USER_INFO, UPDATE_PROFILE } from '../graphql/profile.gql.schema';
import { IProfileStateModel } from '../state/profile.model';
import { IUpdateProfile } from '../../interfaces/update-profile.interface';
import { CheckLocalStorageCache, SharedService } from '@persona/shared';

@Injectable({
	providedIn: 'root',
})
export class ProfileService {
	constructor(
		private http: HttpClient,
		private apollo: Apollo,
		private sharedService: SharedService
	) {}

	@CheckLocalStorageCache()
	getUser(id: string): Observable<IProfileStateModel> {
		return this.apollo
			.query({
				query: GET_USER_INFO,
				variables: {
					id,
				},
			})
			.pipe(
				catchError((error) => error),
				map(({ data }: any) => {
					return data.getUser as IProfileStateModel;
				})
			);
	}

	updateProfile(updateProfile: IUpdateProfile) {
		this.sharedService.executingLoader$.next(true);

		const { profilePicture, profileCover, ...user } = updateProfile;

		console.log(profilePicture, user);

		updateProfile;
		return this.apollo
			.mutate({
				mutation: UPDATE_PROFILE,
				variables: {
					user,
					profilePicture: profilePicture ?? null,
					profileCover: profileCover ?? null,
				},
				context: {
					useMultipart: true,
				},
			})
			.pipe(
				catchError((error) => error),
				map(({ data }: any) => {
					return data.updateUser;
				})
			);
	}
}
