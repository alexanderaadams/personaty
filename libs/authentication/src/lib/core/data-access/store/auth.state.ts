import { Injectable, OnDestroy } from '@angular/core';
import { of } from 'rxjs';
import { Action, State, StateContext, Selector } from '@ngxs/store';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { AuthStateModel } from './auth.model';
import {
	Login,
	Logout,
	Signup,
	ConfirmForgotPassword,
	SendForgotPasswordEmail,
	LoginWithGoogle,
	IsAuthenticated,
	ResetAuthStoreToDefault,
} from './auth.action';
import { AuthService } from '../services/auth.service';
import { UnsubscribeOnDestroyAdapter } from '@persona/shared';

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
		private router: Router // private myStorageEngineService: MyStorageEngineService
	) {
		super();
	}

	// updateMyStorageEngineService(key: string, value: any) {
	// 	this.myStorageEngineService.removeItem(key);
	// 	this.myStorageEngineService.setItem(key, JSON.stringify(value));
	// }

	@Action(Signup, { cancelUncompleted: true })
	signup(ctx: StateContext<AuthStateModel>, action: Signup) {
		this.subs.sink = this.authService.signup(action.payload).subscribe({
			next: (res: any) => {
				ctx.patchState(res as AuthStateModel);
				// this.updateMyStorageEngineService('auth', res);
			},
			error: () => {
				ctx.patchState({
					status: 'FAILED_TO_SIGNUP',
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
				// this.updateMyStorageEngineService('auth', res);
			},
			error: () => {
				ctx.patchState({
					status: 'FAILED_TO_LOGIN',
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
					status: 'SUPPOSEDLY_LOGGED_IN_WITH_GOOGLE',
					authenticated: null,
				});

				// this.updateMyStorageEngineService('auth', res);
			},
			error: () => {
				ctx.patchState({
					status: 'FAILED_TO_LOG_IN_WITH_GOOGLE',
					authenticated: false,
				});
			},
		});
	}

	@Action(SendForgotPasswordEmail, { cancelUncompleted: true })
	sendForgotPasswordEmail(
		ctx: StateContext<AuthStateModel>,
		action: SendForgotPasswordEmail
	) {
		this.subs.sink = this.authService
			.sendForgotPasswordEmail(action.payload)
			.subscribe({
				next: (res: any) => {
					ctx.patchState(res as AuthStateModel);
					// this.updateMyStorageEngineService('auth', res);
				},
				error: () => {
					ctx.patchState({
						status: 'FAILED_TO_SEND_FORGOT_PASSWORD_EMAIL',
						authenticated: false,
					});
				},
			});
	}

	@Action(ConfirmForgotPassword, { cancelUncompleted: true })
	confirmForgotPassword(
		ctx: StateContext<AuthStateModel>,
		action: ConfirmForgotPassword
	) {
		this.subs.sink = this.authService
			.confirmForgotPassword(action.payload)
			.subscribe({
				next: (res: any) => {
					ctx.patchState(res as AuthStateModel);
					// this.updateMyStorageEngineService('auth', res);
				},
				error: () => {
					ctx.patchState({
						status: `FAILED_TO_CONFIRM_FORGOT_PASSWORD`,
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
				// this.updateMyStorageEngineService('auth', res);
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
				// this.updateMyStorageEngineService('auth', res);
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
		// this.updateMyStorageEngineService('auth', {
		// 	status: 'Reset Auth Store To Default',
		// 	authenticated: null,
		// });
	}
}
