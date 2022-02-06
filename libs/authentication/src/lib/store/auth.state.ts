import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { AuthStateModel, Login, Logout, Signup } from './auth.actions';
import { Action, State, StateContext, Selector } from '@ngxs/store';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';

@State<AuthStateModel>({
	name: 'auth',
	defaults: {
		token: null,
		username: null,
	},
})
@Injectable()
export class AuthState {
	@Selector()
	static token(state: AuthStateModel): string | null {
		return state.token;
	}

	@Selector()
	static isAuthenticated(state: AuthStateModel): boolean {
		return !!state.token;
	}

	constructor(
		private authService: AuthService,
		private cookieService: CookieService
	) {}

	@Action(Signup)
	signup(ctx: StateContext<AuthStateModel>, action: Signup) {
		return this.authService.signup(action.payload).pipe(
			tap((result: { token: string }) => {
				ctx.setState({
					token: result.token,
					username: action.payload.username,
				});
			})
		);
	}

	@Action(Login)
	login(ctx: StateContext<AuthStateModel>, action: Login) {
		return this.authService.login(action.payload).pipe(
			tap((result: any) => {
				ctx.patchState({
					token: result.token,
					username: action.payload.username,
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
