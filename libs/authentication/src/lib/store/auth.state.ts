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
	ResetAuthStoreToDefault,
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
		this.subs.sink = this.authService.signup(action.payload).subscribe({
			next: (res: any) => {
				ctx.patchState(res as AuthStateModel);
				this.updateMyStorageEngineService('auth', res);
			},
			error: () => {
				ctx.patchState({
					status: `Failed to signup`,
					authenticated: false,
				});
			},
		});
	}

	@Action(Login, { cancelUncompleted: true })
	login(ctx: StateContext<AuthStateModel>, action: Login) {
		this.subs.sink = this.authService.login(action.payload).subscribe({
			next: (res: any) => {
				ctx.patchState(res as AuthStateModel);
				this.updateMyStorageEngineService('auth', res);
			},
			error: () => {
				ctx.patchState({
					status: `Failed to login`,
					authenticated: false,
				});
			},
		});
	}

	@Action(LoginWithGoogle, { cancelUncompleted: true })
	loginWithGoogle(ctx: StateContext<AuthStateModel>) {
		this.subs.sink = of(this.authService.loginWithGoogle()).subscribe({
			next: (res: any) => {
				ctx.patchState({
					status: 'Supposedly logged in with google',
					authenticated: null,
				});

				this.updateMyStorageEngineService('auth', res);
			},
			error: () => {
				ctx.patchState({
					status: `Failed to login with google`,
					authenticated: false,
				});
			},
		});
	}

	@Action(ForgotPassword, { cancelUncompleted: true })
	sendForgotPasswordEmail(
		ctx: StateContext<AuthStateModel>,
		action: ForgotPassword
	) {
		this.subs.sink = this.authService
			.sendForgotPasswordEmail(action.payload)
			.subscribe({
				next: (res: any) => {
					ctx.patchState(res as AuthStateModel);
					this.updateMyStorageEngineService('auth', res);
				},
				error: () => {
					ctx.patchState({
						status: `Failed to forgot password`,
						authenticated: false,
					});
				},
			});
	}

	@Action(ConfirmForgotPassword, { cancelUncompleted: true })
	resetPassword(
		ctx: StateContext<AuthStateModel>,
		action: ConfirmForgotPassword
	) {
		this.subs.sink = this.authService.resetPassword(action.payload).subscribe({
			next: (res: any) => {
				ctx.patchState(res as AuthStateModel);
				this.updateMyStorageEngineService('auth', res);
			},
			error: () => {
				ctx.patchState({
					status: `Failed to Reset Password`,
					authenticated: false,
				});
			},
		});
	}

	@Action(Logout, { cancelUncompleted: true })
	logout(ctx: StateContext<AuthStateModel>) {
		this.subs.sink = this.authService.logout().subscribe({
			next: (res: any) => {
				ctx.patchState(res as AuthStateModel);
				this.updateMyStorageEngineService('auth', res);
			},
			error: () => {
				ctx.patchState({
					status: `EITHER_LOGGED_OUT_ALREADY_OR_INTERNET_PROBLEM`,
					authenticated: null,
				});
			},
		});
	}

	@Action(IsAuthenticated, { cancelUncompleted: true })
	isAuthenticated(ctx: StateContext<AuthStateModel>) {
		this.subs.sink = this.authService.isAuthenticated().subscribe({
			next: (res: any) => {
				ctx.patchState(res as AuthStateModel);
				this.updateMyStorageEngineService('auth', res);
			},
			error: () => {
				ctx.patchState({
					status: 'NOT_AUTHENTICATED',
					authenticated: false,
				});
			},
		});
	}

	@Action(ResetAuthStoreToDefault, { cancelUncompleted: true })
	resetAuthStoreToDefault(ctx: StateContext<AuthStateModel>) {
		ctx.patchState({
			status: 'Reset Auth Store To Default',
			authenticated: null,
		});
		this.updateMyStorageEngineService('auth', {
			status: 'Reset Auth Store To Default',
			authenticated: null,
		});
	}
}
