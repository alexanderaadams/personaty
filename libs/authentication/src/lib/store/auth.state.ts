import { Injectable, OnDestroy } from '@angular/core';
import { of, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import {
	Login,
	Logout,
	Signup,
	ConfirmForgotPassword,
	ForgotPassword,
	LoginWithGoogle,
	IsAuthenticated,
} from './auth.action';
import { Action, State, StateContext, Selector } from '@ngxs/store';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthStateModel } from './auth.model';
import { UnsubscribeOnDestroyAdapter } from '../shared/unsubscribe-on-destroy.adapter';
import { MyStorageEngineService } from '../shared/storage.service';
@State<AuthStateModel>({
	name: 'auth',
	defaults: {
		status: null,
		authenticated: null,
	},
})
@Injectable()
export class AuthState
	extends UnsubscribeOnDestroyAdapter
	implements OnDestroy
{
	@Selector()
	static isAuthenticated(state: AuthStateModel): boolean {
		return !!state.authenticated;
	}

	constructor(
		private authService: AuthService,
		private cookieService: CookieService,
		private router: Router,
		private myStorageEngineService: MyStorageEngineService
	) {
		super();
	}

	updateMyStorageEngineService(key: string, value: any) {
		this.myStorageEngineService.removeItem(key);
		this.myStorageEngineService.setItem(key, JSON.stringify(value));
	}

	@Action(Signup, { cancelUncompleted: true })
	signup(ctx: StateContext<AuthStateModel>, action: Signup) {
		this.subs.sink = this.authService
			.signup(action.payload)
			.pipe(
				tap((res) => {
					// console.log(res);
					ctx.patchState(res);
					this.updateMyStorageEngineService('auth', res);
				})
			)
			.subscribe();
	}

	@Action(Login, { cancelUncompleted: true })
	login(ctx: StateContext<AuthStateModel>, action: Login) {
		this.subs.sink = this.authService
			.login(action.payload)
			.pipe(
				tap((res) => {
					// console.log(res);
					ctx.patchState(res);
					this.updateMyStorageEngineService('auth', res);
				})
			)
			.subscribe();
	}

	@Action(LoginWithGoogle, { cancelUncompleted: true })
	loginWithGoogle(ctx: StateContext<AuthStateModel>) {
		this.subs.sink = of(this.authService.loginWithGoogle())
			.pipe(
				tap((res: any) => {
					// console.log(res);
					ctx.patchState({
						status: 'Supposedly logged-in-with-google',
						authenticated: null,
					});
					this.updateMyStorageEngineService('auth', res);
				})
			)
			.subscribe();
	}

	@Action(ForgotPassword, { cancelUncompleted: true })
	forgotPassword(ctx: StateContext<AuthStateModel>, action: ForgotPassword) {
		this.subs.sink = this.authService
			.forgotPassword(action.payload)
			.pipe(
				tap((res) => {
					// console.log(res);
					ctx.patchState(res);
					this.updateMyStorageEngineService('auth', res);
				})
			)
			.subscribe();
	}

	@Action(ConfirmForgotPassword, { cancelUncompleted: true })
	resetPassword(
		ctx: StateContext<AuthStateModel>,
		action: ConfirmForgotPassword
	) {
		this.subs.sink = this.authService
			.resetPassword(action.payload)
			.pipe(
				tap((res) => {
					// console.log(res);
					ctx.patchState(res);
					this.updateMyStorageEngineService('auth', res);
				})
			)
			.subscribe();
	}

	@Action(Logout, { cancelUncompleted: true })
	logout(ctx: StateContext<AuthStateModel>) {
		this.subs.sink = this.authService
			.logout()
			.pipe(
				tap((res) => {
					// console.log(res);
					ctx.patchState(res);
					this.updateMyStorageEngineService('auth', res);
				})
			)
			.subscribe();
	}

	@Action(IsAuthenticated, { cancelUncompleted: true })
	isAuthenticated(ctx: StateContext<AuthStateModel>) {
		this.subs.sink = this.authService
			.isAuthenticated()
			.pipe(
				tap((res) => {
					// console.log(res);
					ctx.patchState(res);
					this.updateMyStorageEngineService('auth', res);
				})
			)
			.subscribe();
	}
}
