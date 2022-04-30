/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from '../../unsubscribe-on-destroy.adapter';
import {
	Actions,
	ActionType,
	ofActionCompleted,
	Select,
	Store,
} from '@ngxs/store';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

import { AuthStateModel } from '../../../data-access/store/auth.model';
import {
	IsAuthenticated,
	ResetAuthStoreToDefault,
} from '../../../data-access/store/auth.action';

@Injectable({
	providedIn: 'root',
})
export class FormService extends UnsubscribeOnDestroyAdapter {
	loginExecutingLoader$ = new BehaviorSubject<boolean>(false);
	isBrowser: boolean;

	@Select('auth')
	isAuthenticated$!: Observable<AuthStateModel>;

	constructor(
		private actions$: Actions,
		private _snackBar: MatSnackBar,
		private router: Router,
		private store: Store,
		private activatedRoute: ActivatedRoute,
		@Inject(PLATFORM_ID) private platformId: Record<string, unknown>
	) {
		super();
		this.isBrowser = isPlatformBrowser(platformId);
	}
	private ngUnsubscribeCheckIfAlreadyAuthenticated = new Subject<void>();

	checkIfAlreadyAuthenticated() {
		// let count = 0;

		this.isAuthenticated$
			.pipe(
				tap(({ status }: any) => {
					// const currentRoute = this.router.url;
					// console.log(count++, currentRoute, typeof currentRoute);

					if (status === 'NOT_AUTHENTICATED') {
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
		this.actions$
			.pipe(
				ofActionCompleted(action),
				tap(() => {
					this.loginExecutingLoader$.next(true);

					this.isAuthenticated$
						.pipe(
							tap(({ status, authenticated }: any) => {
								if (authenticated !== null && status !== null) {
									this.loginExecutingLoader$.next(false);
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
				}),
				take(2)
			)
			.subscribe();
	}

	goAuthenticate(action: any) {
		this.store.dispatch(new ResetAuthStoreToDefault());
		this.store.dispatch(action);
	}
}
