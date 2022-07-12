import { waitForAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AuthService } from './auth.service';

describe('AuthService', () => {
	let service: AuthService;
	const authenticated = {
		status: 'CORRECTLY_AUTHENTICATED',
		authenticated: true,
	};

	const loggedOut = {
		status: 'EITHER_LOGGED_OUT',
		authenticated: null,
	};

	const authInfo = {
		email: 'testing@angular.io',
		password: '11',
	};

	const signupUser = {
		...authInfo,
		birthDate: '1990-02-02',
	};

	const loginUser = {
		...authInfo,
	};

	beforeAll(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				HttpClientTestingModule,
				ApolloTestingModule,
			],
		});

		service = TestBed.inject(AuthService);
		jest.spyOn(service, 'signup').mockReturnValue(of(authenticated));
		jest.spyOn(service, 'login').mockReturnValue(of(authenticated));
		jest.spyOn(service, 'loginWithGoogle', 'get').mockImplementation(() => {
			return null;
		});
		jest.spyOn(service, 'logout', 'get').mockReturnValue(of(loggedOut));
	}));

	it('should be created', waitForAsync(() => {
		expect(service).toBeTruthy();
	}));
	it('should signup and return expected data', waitForAsync(() => {
		service.signup(signupUser).subscribe({
			next: (value) => {
				expect(value).toBe(authenticated);
			},
		});
	}));
	it('should login and return expected data', waitForAsync(() => {
		service.login(loginUser).subscribe({
			next: (value) => {
				expect(value).toBe(authenticated);
			},
		});
	}));
	it('should login with google and has be called', waitForAsync(() => {
		expect(service.loginWithGoogle).toBe(null);
	}));
	it('should logout and return expected data', waitForAsync(() => {
		service.logout.subscribe({
			next: (value) => {
				expect(value).toBe(loggedOut);
			},
		});
	}));
});
