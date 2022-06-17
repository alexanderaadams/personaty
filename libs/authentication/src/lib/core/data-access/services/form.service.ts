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
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

import { IAuthStateModel } from '../store/auth.model';
import { IsAuthenticated, ResetAuthStoreToDefault } from '../store/auth.action';

@Injectable({
	providedIn: 'root',
})
export class FormService {
	@Select('auth')
	isAuthenticated$!: Observable<IAuthStateModel>;

	formValue$: BehaviorSubject<unknown | null> = new BehaviorSubject<
		unknown | null
	>('');

	constructor(
		private readonly actions$: Actions,
		private readonly _snackBar: MatSnackBar,
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
							this.router.navigateByUrl('/auth/login');
					}
					// if (status === 'CORRECTLY_AUTHENTICATED') {

					// }
				}),
				takeUntil(this.ngUnsubscribeCheckIfAlreadyAuthenticated)
			)
			.subscribe();

		this.goAuthenticate(IsAuthenticated);
	}

	followAuthenticationStatus(
		action: ActionType,
		snackBarFailedMessage: string,
		snackBarSuccessMessage: string
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
								this.formValue$.next('');
								this.router.navigate(['']);
								this._snackBar.open(snackBarSuccessMessage, '', {
									duration: 3000,
									panelClass: 'snack-bar-success',
								});
							}

							if (authenticated === false && status !== 'NOT_AUTHENTICATED')
								this._snackBar.open(snackBarFailedMessage, '', {
									duration: 3000,
									panelClass: 'snack-bar-danger',
								});

							if (status === 'SENT_SIGNUP_EMAIL_SUCCESSFULLY') {
								this._snackBar.open(snackBarSuccessMessage, '', {
									duration: 3000,
									panelClass: 'snack-bar-success',
								});
							}

							if (
								status === 'LOGGED_OUT_SUCCESSFULLY' ||
								status === 'EITHER_LOGGED_OUT_ALREADY_OR_INTERNET_PROBLEM' ||
								status === 'FORGOT_PASSWORD_EMAIL_SENT_SUCCESSFULLY'
							) {
								this._snackBar.open(snackBarSuccessMessage, '', {
									duration: 3000,
									panelClass: 'snack-bar-success',
								});
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
