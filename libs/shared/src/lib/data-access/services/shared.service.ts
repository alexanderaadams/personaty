import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { IUserAvailableRequest } from '../../interfaces/is-user-available-request';
import { Is_User_Available } from '../../graphql/shared.gql.schema';
import { IUserAvailableResponse } from '../../interfaces/is-user-available-response';

@Injectable({
	providedIn: 'root',
})
export class SharedService {
	executingLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false
	);

	isBrowser: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	isServer: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(
		@Inject(PLATFORM_ID) private platformId: Record<string, unknown>,
		private apollo: Apollo
	) {
		this.isBrowser.next(isPlatformBrowser(this.platformId));
		this.isServer.next(isPlatformServer(this.platformId));
	}

	checkUserAvailable(
		value: IUserAvailableRequest
	): Observable<IUserAvailableResponse> {
		return this.apollo
			.watchQuery({
				query: Is_User_Available,
				variables: {
					findUser: value,
				},
			})
			.valueChanges.pipe(
				catchError((error) => {
					return error;
				}),
				map(({ data }: any) => {
					return data?.isAvailable as IUserAvailableResponse;
				})
			);
	}
}
