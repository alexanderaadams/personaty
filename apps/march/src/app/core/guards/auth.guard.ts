import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';

import { BehaviorSubject, map, Observable, takeUntil, tap } from 'rxjs';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import {
	AuthState,
	IsAuthenticated,
	UnsubscribeOnDestroyAdapter,
	IsAuthenticatedService,
	ResetAuthStoreToDefault,
} from '@march/authentication';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard
	extends UnsubscribeOnDestroyAdapter
	implements CanActivate
{
	@Select(AuthState.isAuthenticated)
	isAuthenticated$!: Observable<boolean>;

	// @Dispatch() isAuthenticatedDispatcher = () => new IsAuthenticated();

	constructor(
		private store: Store,
		private actions$: Actions,
		private router: Router,
		private isAuthenticatedService: IsAuthenticatedService
	) {
		super();
	}

	canActivate():
		| boolean
		| UrlTree
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree> {
		const authenticated$ = new BehaviorSubject<boolean>(false);

		const authenticated = this.store.selectSnapshot(AuthState.isAuthenticated);

		// console.log(authenticated);

		if (authenticated) return true;

		this.subs.sink = this.actions$
			.pipe(
				ofActionCompleted(IsAuthenticated),
				tap((res) => {
					// console.log(res);
					authenticated$.next(true);
					authenticated$.complete();
				})
			)
			.subscribe();

		this.store.dispatch(new IsAuthenticated());

		return this.isAuthenticated$.pipe(
			takeUntil(authenticated$),
			map((authenticated) => {
				// console.log(authenticated);
				if (authenticated) return true;

				this.router.navigate(['auth', 'login']);

				return false;
			})
		);
	}
}
