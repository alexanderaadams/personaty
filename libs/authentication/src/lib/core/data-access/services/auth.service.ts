/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { catchError, map, retry, tap } from 'rxjs/operators';

import {
	ILoginCredentials,
	IConfirmForgotPasswordCredentials,
	ISignupCredentials,
	IUserAvailableRequest,
} from '../store/auth.model';
import {
	SEND_FORGOT_PASSWORD_EMAIL,
	IS_AUTHENTICATED,
	IS_AVAILABLE,
	LOGIN,
	LOGOUT,
	CONFIRM_FORGOT_PASSWORD,
	SIGNUP,
} from '../graphql/auth.gql.schema';
import { environment } from '@persona/shared';
import { SharedService } from '@persona/shared';
import { EMPTY } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	isBrowser = this.sharedService.isBrowser;

	constructor(
		private router: Router,
		private ngZone: NgZone,
		private apollo: Apollo,
		private sharedService: SharedService,
		private http: HttpClient
	) {}

	userAvailable(value: IUserAvailableRequest) {
		this.sharedService.executingLoader$.next(true);
		return this.apollo
			.watchQuery({
				query: IS_AVAILABLE,
				variables: {
					findUser: value,
				},
			})
			.valueChanges.pipe(
				catchError(() => {
					return EMPTY;
				}),
				map(({ data }: any) => {
					return data.isAvailable;
				})
			);
	}

	signup(credentials: ISignupCredentials) {
		this.sharedService.executingLoader$.next(true);
		return this.apollo
			.mutate({
				mutation: SIGNUP,
				variables: {
					user: credentials,
				},
			})
			.pipe(
				catchError((error: any) => {
					return error;
				}),
				map(({ data }: any) => {
					return {
						status: data?.signup?.status,
						authenticated: data?.signup?.authenticated,
					};
				})
			);
	}

	login(credentials: ILoginCredentials) {
		this.sharedService.executingLoader$.next(true);
		return this.apollo
			.mutate({
				mutation: LOGIN,
				variables: {
					user: credentials,
				},
			})
			.pipe(
				catchError((error: any) => {
					return error;
				}),
				map(({ data }: any) => {
					return {
						status: data?.login?.status,
						authenticated: data?.login?.authenticated,
					};
				})
			);
	}

	loginWithGoogle() {
		this.ngZone.run(() => {
			if (this.isBrowser) {
				const newWindow = window.open(
					`${environment.BACKEND_URL}/${environment.BACKEND_BASE_URL}/auth/login-with-google`,
					'_blank',
					'width=600,height=600'
				);
				if (newWindow) {
					const timer = setInterval(() => {
						if (newWindow.closed) {
							this.router.navigate(['']);
							if (timer) clearInterval(timer);
						}
					}, 500);
				}
			}
		});
	}

	sendForgotPasswordEmail(email: { email: string }) {
		this.sharedService.executingLoader$.next(true);
		return this.apollo
			.mutate({
				mutation: SEND_FORGOT_PASSWORD_EMAIL,
				variables: {
					user: email,
				},
			})
			.pipe(
				catchError((error: any) => {
					return error;
				}),
				map(({ data }: any) => {
					return {
						status: data?.sendForgotPasswordEmail?.status,
						authenticated: data?.sendForgotPasswordEmail?.authenticated,
					};
				})
			);
	}

	confirmForgotPassword(credentials: IConfirmForgotPasswordCredentials) {
		this.sharedService.executingLoader$.next(true);
		return this.apollo
			.mutate({
				mutation: CONFIRM_FORGOT_PASSWORD,
				variables: {
					credentials,
				},
			})
			.pipe(
				catchError((error: any) => {
					return error;
				}),
				map(({ data }: any) => {
					return {
						status: data?.confirmForgotPassword?.status,
						authenticated: data?.confirmForgotPassword?.authenticated,
					};
				}),
				retry({ count: 1, delay: 200, resetOnSuccess: true })
			);
	}

	logout() {
		this.sharedService.executingLoader$.next(true);
		return this.apollo
			.query({
				query: LOGOUT,
				// errorPolicy: 'all',
			})
			.pipe(
				catchError((error: any) => {
					return error;
				}),
				map(({ data }: any) => {
					return {
						status: data?.logout?.status,
						authenticated: data?.logout?.authenticated,
					};
				}),
				retry({ count: 1, delay: 200, resetOnSuccess: true })
			);
	}

	isAuthenticated() {
		return this.http
			.get(
				`${environment.BACKEND_URL}/${environment.BACKEND_BASE_URL}/auth/is-authenticated`
			)
			.pipe(
				catchError((error: any) => {
					return error;
				}),
				tap((res) => {
					console.log(res);
				}),
				retry({ count: 1, delay: 200, resetOnSuccess: true })
			);
		// return this.apollo
		// 	.query({
		// 		query: IS_AUTHENTICATED,
		// 	})
		// 	.pipe(
		// 		catchError((error: any) => {
		// 			return error;
		// 		}),
		// 		map(({ data }: any) => {
		// 			return {
		// 				status: data?.isAuthenticated?.status,
		// 				authenticated: data?.isAuthenticated?.authenticated,
		// 			};
		// 		}),
		// 		retry({ count: 1, delay: 200, resetOnSuccess: true })
		// 	);
	}
}
