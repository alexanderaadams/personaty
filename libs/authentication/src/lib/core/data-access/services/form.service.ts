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

import { UnsubscribeOnDestroyAdapter, SharedService } from '@persona/shared';
import { AuthStateModel } from '../store/auth.model';
import { IsAuthenticated, ResetAuthStoreToDefault } from '../store/auth.action';

@Injectable({
	providedIn: 'root',
})
export class FormService extends UnsubscribeOnDestroyAdapter {
	@Select('auth')
	isAuthenticated$!: Observable<AuthStateModel>;

	loginExecutingLoader$: BehaviorSubject<boolean> =
		this.sharedService.loginExecutingLoader$;

	formValue$: BehaviorSubject<unknown | null> = new BehaviorSubject<
		unknown | null
	>('');

	constructor(
		private readonly actions$: Actions,
		private readonly _snackBar: MatSnackBar,
		private readonly router: Router,
		private readonly store: Store,
		private readonly sharedService: SharedService
	) {
		super();
	}
	private ngUnsubscribeCheckIfAlreadyAuthenticated: Subject<void> =
		new Subject<void>();

	private ngUnUnsubscribeFollowAuthenticationStatus: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(true);

	checkIfAlreadyAuthenticated() {
		// let count = 0;

		this.isAuthenticated$
			.pipe(
				tap(({ status }: any) => {
					if (status === 'NOT_AUTHENTICATED') {
						this.router.navigateByUrl('/auth/login');
					}
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
		let i = 1;
		// this.ngUnUnsubscribeFollowAuthenticationStatus.next(true);
		return this.actions$.pipe(
			ofActionCompleted(action),
			tap(() => {
				this.loginExecutingLoader$.next(true);

				this.isAuthenticated$
					.pipe(
						tap(({ status, authenticated }: any) => {
							if (authenticated !== null && status !== null) {
								console.log(authenticated, i++);
								this.ngUnUnsubscribeFollowAuthenticationStatus.next(false);
								this.loginExecutingLoader$.next(false);
								this.formValue$.next('');
							}

							if (authenticated) {
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
								this.loginExecutingLoader$.next(false);
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
