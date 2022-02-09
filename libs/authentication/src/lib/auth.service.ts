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
		// this.http.get<any>();
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
