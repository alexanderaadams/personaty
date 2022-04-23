import { Router } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from './unsubscribe-on-destroy.adapter';
import {
	Actions,
	ActionType,
	ofActionSuccessful,
	Select,
	Store,
} from '@ngxs/store';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthStateModel } from '../store/auth.model';
import { ResetAuthStoreToDefault } from '../store/auth.action';

@Injectable({
	providedIn: 'root',
})
export class IsAuthenticatedService extends UnsubscribeOnDestroyAdapter {
	loginExecutingLoader$ = new BehaviorSubject<boolean>(false);

	@Select('auth')
	isAuthenticated$!: Observable<AuthStateModel>;

	constructor(
		private actions$: Actions,
		private _snackBar: MatSnackBar,
		private router: Router,
		private store: Store
	) {
		super();
	}

	checkActionStatus(
		action: ActionType,
		snackBarFailedMessage: string,
		snackBarSuccessMessage: string
	) {
		this.subs.sink = this.actions$
			.pipe(
				ofActionSuccessful(action),
				tap(() => {
					this.loginExecutingLoader$.next(true);

					this.subs.sink = this.isAuthenticated$
						.pipe(
							tap(({ status, authenticated }) => {
								console.log(authenticated);

								if (authenticated) {
									this.router.navigate(['']);
									this._snackBar.open(snackBarSuccessMessage, 'Dismiss', {
										duration: 3000,
										panelClass: 'snack-bar-success',
									});
								}

								if (authenticated !== null)
									this.loginExecutingLoader$.next(false);

								if (authenticated === false && status !== 'NOT_AUTHENTICATED')
									this._snackBar.open(snackBarFailedMessage, 'Dismiss', {
										duration: 3000,
										panelClass: 'snack-bar-danger',
									});

								if (status === 'SENT_SIGNUP_EMAIL_SUCCESSFULLY') {
									this.loginExecutingLoader$.next(false);
									this._snackBar.open(snackBarSuccessMessage, 'Dismiss', {
										duration: 3000,
										panelClass: 'snack-bar-success',
									});
								}

								if (
									status === 'LOGGED_OUT_SUCCESSFULLY' ||
									status === 'EITHER_LOGGED_OUT_ALREADY_OR_INTERNET_PROBLEM'
								) {
									console.log('LOGGED_OUT_SUCCESSFULLY');
									this._snackBar.open(snackBarSuccessMessage, 'Dismiss', {
										duration: 3000,
										panelClass: 'snack-bar-success',
									});
									this.router.navigate(['auth', 'login']);
								}
							})
						)
						.subscribe();
				})
			)
			.subscribe();
	}

	goAuthenticate(action: any) {
		this.store.dispatch(new ResetAuthStoreToDefault());
		this.store.dispatch(action);
	}
}
