import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { Action, State, StateContext, Selector } from '@ngxs/store';

import { IAuthStateModel } from './auth.model';
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

@State<IAuthStateModel>({
	name: 'auth',
	defaults: {
		status: null,

		authenticated: null,

		userId: null,
	},
})
@Injectable()
export class AuthState {
	@Selector()
	static isAuthenticated(state: IAuthStateModel): boolean {
		return !!state.authenticated;
	}

	@Selector()
	static userId(state: IAuthStateModel): string | null | undefined {
		return state.userId;
	}

	constructor(private authService: AuthService) {}

	@Action(Signup, { cancelUncompleted: true })
	signup(ctx: StateContext<IAuthStateModel>, action: Signup) {
		this.authService.signup(action.payload).subscribe({
			next: (res: any) => {
				ctx.patchState(res);
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
	login(ctx: StateContext<IAuthStateModel>, action: Login) {
		this.authService.login(action.payload).subscribe({
			next: (res: any) => {
				ctx.patchState(res);
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
	loginWithGoogle(ctx: StateContext<IAuthStateModel>) {
		of(this.authService.loginWithGoogle).subscribe({
			next: (res: any) => {
				ctx.patchState({
					status: 'SUPPOSEDLY_LOGGED_IN_WITH_GOOGLE',
					authenticated: null,
				});
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
		ctx: StateContext<IAuthStateModel>,
		action: SendForgotPasswordEmail
	) {
		this.authService.sendForgotPasswordEmail(action.payload).subscribe({
			next: (res: any) => {
				ctx.patchState(res);
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
		ctx: StateContext<IAuthStateModel>,
		action: ConfirmForgotPassword
	) {
		this.authService.confirmForgotPassword(action.payload).subscribe({
			next: (res: any) => {
				ctx.patchState(res);
			},
			error: () => {
				ctx.patchState({
					status: 'FAILED_TO_CONFIRM_FORGOT_PASSWORD',
					authenticated: false,
				});
			},
		});
	}

	@Action(Logout, { cancelUncompleted: true })
	logout(ctx: StateContext<IAuthStateModel>) {
		this.authService.logout.subscribe({
			next: (res: any) => {
				ctx.patchState(res);
			},
			error: () => {
				ctx.patchState({
					status: 'EITHER_LOGGED_OUT_ALREADY_OR_INTERNET_PROBLEM',
					authenticated: null,
				});
			},
		});
	}

	@Action(IsAuthenticated, { cancelUncompleted: true })
	isAuthenticated(ctx: StateContext<IAuthStateModel>) {
		this.authService.isAuthenticated.subscribe({
			next: (res: any) => {
				ctx.patchState(res);
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
	resetAuthStoreToDefault(ctx: StateContext<IAuthStateModel>) {
		ctx.patchState({
			status: 'RESET_AUTH_STORE_TO_DEFAULT',
			authenticated: null,
			userId: null,
		});
	}
}
