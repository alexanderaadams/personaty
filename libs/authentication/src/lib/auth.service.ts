import { CookieService } from 'ngx-cookie-service';
import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import {
	LoginCredentials,
	ResetPasswordCredentials,
	SignupCredentials,
	UserAvailableRequest,
	UserAvailableResponse,
} from './store/auth.model';

import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import {
	FORGOT_PASSWORD,
	IS_AVAILABLE,
	LOGIN,
	LOGOUT,
	RESET_PASSWORD,
	SIGNUP,
} from './gql.schema';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	rootUrl = 'http://localhost:3333/api/v1';
	signedin$ = new BehaviorSubject(false);
	username = '';
	email = '';

	constructor(
		private http: HttpClient,
		private router: Router,
		private ngZone: NgZone,
		private readonly cookieService: CookieService,
		private apollo: Apollo
	) {}

	userAvailable(value: UserAvailableRequest) {
		return this.apollo
			.watchQuery({
				query: IS_AVAILABLE,
				variables: {
					findUser: value,
				},
				errorPolicy: 'all',
				context: {
					withCredentials: true,
				},
			})
			.valueChanges.pipe(
				map(({ data }: any) => {
					return data.isAvailable as UserAvailableResponse;
				})
			);
	}

	signup(credentials: SignupCredentials) {
		console.log(credentials);
		return this.apollo
			.mutate({
				mutation: SIGNUP,
				variables: {
					user: credentials,
				},
				errorPolicy: 'all',
				context: {
					withCredentials: true,
				},
			})
			.pipe(
				map(({ data }: any) => {
					console.log(data);
					return {
						status: data?.signup?.status,
						authenticated: data?.signup?.authenticated,
					};
				}),
				catchError(({ error }) => {
					console.log(error);
					return of({
						status: `Failed to signup, ${error.message} ${error.statusCode}`,
						authenticated: false,
					});
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
				errorPolicy: 'all',
				context: {
					withCredentials: true,
				},
			})
			.pipe(
				map(({ data }: any) => {
					// console.log(data);
					return {
						status: data?.login?.status,
						authenticated: data?.login?.authenticated,
					};
				}),
				catchError(({ error }) => {
					console.log(error);
					return of({
						status: `Failed to login, ${error.message} ${error.statusCode}`,
						authenticated: false,
					});
				})
			);
	}

	loginWithGoogle() {
		this.ngZone.run(() => {
			const newWindow = window.open(
				`${this.rootUrl}/auth/login-with-google`,
				'_blank',
				'width=500,height=600'
			);
			if (newWindow) {
				const timer = setInterval(() => {
					if (newWindow.closed) {
						this.router.navigateByUrl('home');
						if (timer) clearInterval(timer);
					}
				}, 500);
			}
		});
	}

	forgotPassword(email: { email: string }) {
		return this.apollo
			.mutate({
				mutation: FORGOT_PASSWORD,
				variables: {
					user: email,
				},
				errorPolicy: 'all',
				context: {
					withCredentials: true,
				},
			})

			.pipe(
				map(({ data }: any) => {
					// console.log(data);
					return {
						status: data?.forgotPassword?.status,
						authenticated: data?.forgotPassword?.authenticated,
					};
				}),
				catchError(({ error }) => {
					return of({
						status: `Failed to send forgot password email, ${error.message} ${error.statusCode}`,
						authenticated: null,
					});
				})
			);
	}

	resetPassword(credentials: ResetPasswordCredentials) {
		return this.apollo
			.mutate({
				mutation: RESET_PASSWORD,
				variables: {
					credentials,
				},
				errorPolicy: 'all',
				context: {
					withCredentials: true,
				},
			})
			.pipe(
				map(({ data }: any) => {
					// console.log(data);
					return {
						status: data?.resetPasswordToken?.status,
						authenticated: data?.resetPasswordToken?.authenticated,
					};
				}),
				catchError(({ error }) => {
					return of({
						status: `Failed to reset password, ${error.message} ${error.statusCode}`,
						authenticated: false,
					});
				})
			);
	}

	logout() {
		return this.apollo
			.query({
				query: LOGOUT,
				errorPolicy: 'all',
				context: {
					withCredentials: true,
				},
			})
			.pipe(
				map(() => {
					return {
						status: 'Successfully logged out',
						authenticated: false,
					};
				}),
				catchError(({ error }) => {
					return of({
						status: 'Failed to Log out',
						authenticated: false,
					});
				})
			);
	}
}
