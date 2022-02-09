import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

interface UserAvailableResponse {
	available: boolean;
}
interface UserAvailableRequest {
	username?: string;
	email?: string;
}

interface SignupCredentials {
	email: string;
	password: string;
}

interface LoginCredentials {
	username: string;
	password: string;
}
interface ResetPasswordCredentials {
	password: string;
	confirmPassword: string;
	token: string;
}

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
		private cookieService: CookieService,
		private router: Router
	) {}

	userAvailable(value: UserAvailableRequest) {
		return this.http.request<UserAvailableResponse>(
			'POST',
			`${this.rootUrl}/auth/user`,
			{
				body: {
					...value,
				},
			}
		);
	}

	signup(credentials: SignupCredentials) {
		return this.http.post<any>(`${this.rootUrl}/auth/signup`, credentials, {
			withCredentials: true,
		});
	}

	login(credentials: LoginCredentials) {
		return this.http.post<any>(`${this.rootUrl}/auth/login`, credentials, {
			withCredentials: true,
		});
	}

	loginWithGoogle() {
		const headers = new HttpHeaders();
		headers.append('Access-Control-Allow-Origin', '*');
		this.http
			.get<any>(`${this.rootUrl}/auth/login-with-google`, {
				headers,
				withCredentials: true,
			})
			.pipe()
			.subscribe((api) => {
				console.log(api);

				return this.router.navigate(api);
			});
	}

	forgotPassword(email: { email: string }) {
		return this.http.post<any>(`${this.rootUrl}/auth/forgot-password`, email, {
			withCredentials: true,
		});
	}
	resetPassword(credentials: ResetPasswordCredentials) {
		return this.http.post<any>(
			`${this.rootUrl}/auth/reset-password/${credentials.token}`,
			credentials,
			{
				withCredentials: true,
			}
		);
	}
	getAllUser() {
		return this.http.get(`${this.rootUrl}/user/getallusers`);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// logout(user: any) {}
}
