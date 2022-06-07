/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { catchError, map } from 'rxjs/operators';

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

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	// rootUrlProduction = 'https://api-persona2.herokuapp.com/api/v1';
	// rootUrlDevelopment = 'http://localhost:3333/api/v1';
	// signedin$ = new BehaviorSubject(false);
	// username = '';
	// email = '';
	isBrowser = this.sharedService.isBrowser;

	constructor(
		private router: Router,
		private ngZone: NgZone,
		private apollo: Apollo,
		private sharedService: SharedService
	) {}

	userAvailable(value: IUserAvailableRequest) {
		return this.apollo
			.watchQuery({
				query: IS_AVAILABLE,
				variables: {
					findUser: value,
				},
				// errorPolicy: 'all',
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
		return this.apollo
			.mutate({
				mutation: SIGNUP,
				variables: {
					user: credentials,
				},
				// errorPolicy: 'all',
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
		return this.apollo
			.mutate({
				mutation: LOGIN,
				variables: {
					user: credentials,
				},
				// errorPolicy: 'all',
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
		return this.apollo
			.mutate({
				mutation: SEND_FORGOT_PASSWORD_EMAIL,
				variables: {
					user: email,
				},
				// errorPolicy: 'all',
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
		return this.apollo
			.mutate({
				mutation: CONFIRM_FORGOT_PASSWORD,
				variables: {
					credentials,
				},
				// errorPolicy: 'all',
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
				})
			);
	}

	logout() {
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
				})
			);
	}

	isAuthenticated() {
		return this.apollo
			.query({
				query: IS_AUTHENTICATED,
				// errorPolicy: 'all',
			})
			.pipe(
				catchError((error: any) => {
					return error;
				}),
				map(({ data }: any) => {
					return {
						status: data?.isAuthenticated?.status,
						authenticated: data?.isAuthenticated?.authenticated,
					};
				})
			);
	}
}
