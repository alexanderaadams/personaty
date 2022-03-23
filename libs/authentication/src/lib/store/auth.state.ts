import { Injectable } from '@angular/core';
import { catchError, map, of, Subscription, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import {
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
import { AuthStateModel } from './auth.model';

@State<AuthStateModel>({
	name: 'Auth',
	defaults: {
		status: null,
		authenticated: null,
	},
})
@Injectable()
export class AuthState {
	private querySubscription!: Subscription;
	// @Selector()
	// static isAuthenticated(state: AuthStateModel): boolean {
	// 	return !!state.authenticated;
	// }

	constructor(
		private authService: AuthService,
		private cookieService: CookieService,
		private router: Router
	) {}

	@Action(Signup)
	signup(ctx: StateContext<AuthStateModel>, action: Signup) {
		this.querySubscription = this.authService
			.signup(action.payload)
			.pipe(
				tap((res) => {
					console.log(res);
					ctx.patchState(res);
				})
			)
			.subscribe();
	}

	@Action(Login)
	login(ctx: StateContext<AuthStateModel>, action: Login) {
		this.querySubscription = this.authService
			.login(action.payload)
			.pipe(
				tap((res) => {
					console.log(res);
					ctx.patchState(res);
				})
			)
			.subscribe();
	}

	@Action(LoginWithGoogle)
	loginWithGoogle(ctx: StateContext<AuthStateModel>, action: LoginWithGoogle) {
		this.querySubscription = of(this.authService.loginWithGoogle())
			.pipe(
				tap((res: any) => {
					console.log(res);
					ctx.patchState({
						status: 'Supposedly logged-in-with-google',
						authenticated: null,
					});
				})
			)
			.subscribe();
	}

	@Action(ForgotPassword)
	forgotPassword(ctx: StateContext<AuthStateModel>, action: ForgotPassword) {
		this.querySubscription = this.authService
			.forgotPassword(action.payload)
			.pipe(
				tap((res) => {
					console.log(res);
					ctx.patchState(res);
				})
			)
			.subscribe();
	}

	@Action(ResetPassword)
	resetPassword(ctx: StateContext<AuthStateModel>, action: ResetPassword) {
		this.querySubscription = this.authService
			.resetPassword(action.payload)
			.pipe(
				tap((res) => {
					console.log(res);
					ctx.patchState(res);
				})
			)
			.subscribe();
	}

	@Action(Logout)
	logout(ctx: StateContext<AuthStateModel>) {
		this.querySubscription = this.authService
			.logout()
			.pipe(
				tap((res) => {
					console.log(res);
					ctx.patchState(res);
				})
			)
			.subscribe();
	}

	ngOnDestroy() {
		this.querySubscription.unsubscribe();
	}
}
