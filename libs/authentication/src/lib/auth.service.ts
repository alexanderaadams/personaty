import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

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

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	rootUrl = 'http://localhost:3333/api/v1';
	signedin$ = new BehaviorSubject(false);
	username = '';
	email = '';

	constructor(private http: HttpClient, private cookieService: CookieService) {}

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
	getAllUser() {
		return this.http.get(`${this.rootUrl}/user/getallusers`);
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	logout(user: any) {}
}
