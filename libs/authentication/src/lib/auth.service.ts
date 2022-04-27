import { FormService } from './shared/form.service';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
	LoginCredentials,
	ResetPasswordCredentials,
	SignupCredentials,
	UserAvailableRequest,
} from './store/auth.model';

import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import {
	FORGOT_PASSWORD,
	IS_AUTHENTICATED,
	IS_AVAILABLE,
	LOGIN,
	LOGOUT,
	RESET_PASSWORD,
	SIGNUP,
} from './auth.gql.schema';
import { catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	rootUrlProduction = 'https://api-persona2.herokuapp.com/api/v1';
	// rootUrlDevelopment = 'http://localhost:3333/api/v1';
	// signedin$ = new BehaviorSubject(false);
	// username = '';
	// email = '';
	isBrowser = this.formService.isBrowser;

	constructor(
		private http: HttpClient,
		private router: Router,
		private ngZone: NgZone,
		private apollo: Apollo,
		private formService: FormService
	) {}

	userAvailable(value: UserAvailableRequest) {
		return this.apollo
			.watchQuery({
				query: IS_AVAILABLE,
				variables: {
					findUser: value,
				},
				// errorPolicy: 'all',
				context: {
					withCredentials: true,
				},
			})
			.valueChanges.pipe(
				map(({ data }: any) => {
					return data.isAvailable;
				})
			);
	}

	signup(credentials: SignupCredentials) {
		return this.apollo
			.mutate({
				mutation: SIGNUP,
				variables: {
					user: credentials,
				},
				// errorPolicy: 'all',
				context: {
					withCredentials: true,
				},
			})
			.pipe(
				map(({ data }: any) => {
					return {
						status: data?.signup?.status,
						authenticated: data?.signup?.authenticated,
					};
				}),
				catchError((error: any) => {
					return error;
				})
			);
	}

	login(credentials: LoginCredentials) {
		return this.apollo
			.mutate({
				mutation: LOGIN,
				variables: {
					user: credentials,
				},
				// errorPolicy: 'all',
				context: {
					withCredentials: true,
				},
			})
			.pipe(
				map(({ data }: any) => {
					return {
						status: data?.login?.status,
						authenticated: data?.login?.authenticated,
					};
				}),
				catchError((error: any) => {
					return error;
				})
			);
	}

	loginWithGoogle() {
		this.ngZone.run(() => {
			if (this.isBrowser) {
				const newWindow = window.open(
					`${this.rootUrlProduction}/auth/login-with-google`,
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
				mutation: FORGOT_PASSWORD,
				variables: {
					user: email,
				},
				// errorPolicy: 'all',
				context: {
					withCredentials: true,
				},
			})

			.pipe(
				map(({ data }: any) => {
					return {
						status: data?.forgotPassword?.status,
						authenticated: data?.forgotPassword?.authenticated,
					};
				}),
				catchError((error: any) => {
					return error;
				})
			);
	}

	resetPassword(credentials: ResetPasswordCredentials): any {
		return this.apollo
			.mutate({
				mutation: RESET_PASSWORD,
				variables: {
					credentials,
				},
				// errorPolicy: 'all',
				context: {
					withCredentials: true,
				},
			})
			.pipe(
				map(({ data }: any) => {
					return {
						status: data?.resetPasswordToken?.status,
						authenticated: data?.resetPasswordToken?.authenticated,
					};
				}),
				catchError((error: any) => {
					return error;
				})
			)
			.subscribe();
	}

	logout() {
		return this.apollo
			.query({
				query: LOGOUT,
				// errorPolicy: 'all',
				context: {
					withCredentials: true,
				},
			})
			.pipe(
				map(({ data }: any) => {
					return {
						status: data?.logout?.status,
						authenticated: data?.logout?.authenticated,
					};
				}),
				catchError((error: any) => {
					return error;
				})
			);
	}

	isAuthenticated() {
		return this.apollo
			.query({
				query: IS_AUTHENTICATED,
				// errorPolicy: 'all',
				context: {
					withCredentials: true,
				},
			})
			.pipe(
				map(({ data }: any) => {
					return {
						status: data?.isAuthenticated?.status,
						authenticated: data?.isAuthenticated?.authenticated,
					};
				}),
				catchError((error: any) => {
					return error;
				})
			);
	}
}
