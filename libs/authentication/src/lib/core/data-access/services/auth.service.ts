import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';

import { catchError, map, retry, take } from 'rxjs/operators';

import { environment, SharedService } from '@persona/shared';

import {
	ILoginCredentials,
	IConfirmForgotPasswordCredentials,
	ISignupCredentials,
} from '../state/auth.model';
import {
	SEND_FORGOT_PASSWORD_EMAIL,
	LOGIN,
	LOGOUT,
	CONFIRM_FORGOT_PASSWORD,
	SIGNUP,
} from '../graphql/auth.gql.schema';

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
						status: data?.signup.status,
						authenticated: data?.signup.authenticated,
					};
				}),
				take(1)
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
						status: data?.login.status,
						authenticated: data?.login.authenticated,
					};
				}),
				take(1)
			);
	}

	get loginWithGoogle() {
		return this.ngZone.run(() => {
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
						status: data?.sendForgotPasswordEmail.status,
						authenticated: data?.sendForgotPasswordEmail.authenticated,
					};
				}),
				take(1)
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
						status: data?.confirmForgotPassword.status,
						authenticated: data?.confirmForgotPassword.authenticated,
					};
				}),
				take(1),
				retry({ count: 1, delay: 200, resetOnSuccess: true })
			);
	}

	get logout() {
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
						status: data?.logout.status,
						authenticated: data?.logout.authenticated,
					};
				}),
				take(1),
				retry({ count: 1, delay: 200, resetOnSuccess: true })
			);
	}

	get isAuthenticated() {
		return this.http
			.get(
				`${environment.BACKEND_URL}/${environment.BACKEND_BASE_URL}/auth/is-authenticated`,
				{ withCredentials: true }
			)
			.pipe(
				catchError((error: any) => {
					return error;
				}),
				take(1),
				retry({ count: 1, delay: 200, resetOnSuccess: true })
			);
	}
}
