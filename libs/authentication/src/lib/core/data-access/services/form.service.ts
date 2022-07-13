/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from '@angular/router';
import {
	Actions,
	ActionType,
	ofActionCompleted,
	Select,
	Store,
} from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

import { IAuthStateModel } from '../state/auth.model';
import { IsAuthenticated, ResetAuthStoreToDefault } from '../state/auth.action';

@Injectable({
	providedIn: 'root',
})
export class FormService {
	@Select('auth')
	isAuthenticated$!: Observable<IAuthStateModel>;

	value$: BehaviorSubject<unknown | null> = new BehaviorSubject<unknown | null>(
		null
	);

	constructor(
		private readonly actions$: Actions,
		private readonly toastController: ToastController,
		private readonly router: Router,
		private readonly store: Store
	) {}
	private ngUnsubscribeCheckIfAlreadyAuthenticated: Subject<void> =
		new Subject<void>();

	private ngUnUnsubscribeFollowAuthenticationStatus: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(true);

	checkIfAlreadyAuthenticated() {
		this.isAuthenticated$
			.pipe(
				tap(({ status }: any) => {
					if (status === 'NOT_AUTHENTICATED') {
						if (!this.router.url.includes('/auth/'))
							this.router.navigate(['/', 'auth', 'login']);
					}
					if (status === 'CORRECTLY_AUTHENTICATED') {
						if (this.router.url.includes('/auth/')) this.router.navigate(['']);
					}
				}),
				takeUntil(this.ngUnsubscribeCheckIfAlreadyAuthenticated)
			)
			.subscribe();

		this.goAuthenticate(IsAuthenticated);
	}

	followAuthenticationStatus(
		action: ActionType,
		toastFailedMessage: string,
		toastSuccessMessage: string
	) {
		return this.actions$.pipe(
			ofActionCompleted(action),
			tap(() => {
				this.isAuthenticated$
					.pipe(
						tap(({ status, authenticated }: any) => {
							if (authenticated !== null && status !== null) {
								this.ngUnUnsubscribeFollowAuthenticationStatus.next(false);
							}

							if (authenticated) {
								this.value$.next(null);
								this.router.navigate(['']);
								this.toastController
									.create({
										message: toastSuccessMessage,
										duration: 3000,
										color: 'success',
										animated: true,
										position: 'bottom',
									})
									.then((toast: any) => toast.present());
							}

							if (authenticated === false && status !== 'NOT_AUTHENTICATED')
								this.toastController
									.create({
										message: toastFailedMessage,
										duration: 3000,
										color: 'danger',
										animated: true,
										position: 'bottom',
									})
									.then((toast) => toast.present());

							if (status === 'SENT_SIGNUP_EMAIL_SUCCESSFULLY') {
								this.toastController
									.create({
										message: toastSuccessMessage,
										duration: 3000,
										color: 'success',
										animated: true,
										position: 'bottom',
									})
									.then((toast) => toast.present());
							}

							if (
								status === 'LOGGED_OUT_SUCCESSFULLY' ||
								status === 'EITHER_LOGGED_OUT_ALREADY_OR_INTERNET_PROBLEM' ||
								status === 'FORGOT_PASSWORD_EMAIL_SENT_SUCCESSFULLY'
							) {
								this.toastController
									.create({
										message: toastSuccessMessage,
										duration: 3000,
										color: 'success',
										animated: true,
										position: 'bottom',
									})
									.then((toast) => toast.present());
								this.router.navigate(['auth', 'login']);
							}
							if (status === 'PASSWORD_UPDATED_SUCCESSFULLY') {
								this.router.navigate(['auth', 'login']);
							}
						}),
						take(2)
					)
					.subscribe();
			})
		);
	}

	goAuthenticate(action: any) {
		this.store.dispatch(new ResetAuthStoreToDefault());
		this.store.dispatch(action);
	}
}
