import { Injectable } from '@angular/core';
import { of, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import {
	AuthStateModel,
	Login,
	Logout,
	Signup,
	ResetPassword,
	ForgotPassword,
	LoginWithGoogle,
} from './auth.actions';
import { Action, State, StateContext, Selector } from '@ngxs/store';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@State<AuthStateModel>({
	name: 'auth',
	defaults: {
		status: null,
		username: null,
	},
})
@Injectable()
export class AuthState {
	@Selector()
	static isAuthenticated(state: AuthStateModel): boolean {
		return !!state.status;
	}

	constructor(
		private authService: AuthService,
		private cookieService: CookieService,
		private router: Router
	) {}

	@Action(Signup)
	signup(ctx: StateContext<AuthStateModel>, action: Signup) {
		return this.authService.signup(action.payload).pipe(
			tap(() => {
				ctx.setState({
					status: 'signed-up',
					username: action.payload.username,
				});
			})
		);
	}

	@Action(Login)
	login(ctx: StateContext<AuthStateModel>, action: Login) {
		return this.authService.login(action.payload).pipe(
			tap(() => {
				ctx.patchState({
					status: 'logged-in',
					username: action.payload.username,
				});
			})
		);
	}

	@Action(LoginWithGoogle)
	loginWithGoogle(ctx: StateContext<AuthStateModel>, action: LoginWithGoogle) {
		return of(this.authService.loginWithGoogle()).pipe(
			tap((result: any) => {
				ctx.patchState({
					status: 'logged-in-with-google',
				});
			})
		);
	}

	@Action(ForgotPassword)
	forgotPassword(ctx: StateContext<AuthStateModel>, action: ForgotPassword) {
		return this.authService.forgotPassword(action.payload).pipe(
			tap(() => {
				ctx.patchState({
					status: 'forgotPassword',
				});
			})
		);
	}

	@Action(ResetPassword)
	resetPassword(ctx: StateContext<AuthStateModel>, action: ResetPassword) {
		console.log(action.payload);
		return this.authService.resetPassword(action.payload).pipe(
			tap(() => {
				ctx.patchState({
					status: 'reset-password',
				});
			})
		);
	}

	// @Action(Logout)
	// logout(ctx: StateContext<AuthStateModel>) {
	// 	const state = ctx.getState();
	// 	return this.authService.logout(state.token).pipe(
	// 		tap(() => {
	// 			ctx.setState({
	// 				token: null,
	// 				username: null,
	// 			});
	// 		})
	// 	);
	// }
}
