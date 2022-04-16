import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';

import { BehaviorSubject, map, Observable, takeUntil, tap } from 'rxjs';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import {
	AuthState,
	IsAuthenticated,
	UnsubscribeOnDestroyAdapter,
} from '@march/authentication';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard
	extends UnsubscribeOnDestroyAdapter
	implements CanActivate
{
	@Select(AuthState.isAuthenticated)
	isAuthenticated$!: Observable<boolean>;

	@Dispatch() isAuthenticatedDispatcher = () => new IsAuthenticated();

	constructor(
		private store: Store,
		private actions$: Actions,
		private router: Router
	) {
		super();
	}

	canActivate():
		| boolean
		| UrlTree
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree> {
		const isAuthenticated = new BehaviorSubject<boolean>(false);

		const authenticated = this.store.selectSnapshot(AuthState.isAuthenticated);

		if (!authenticated) return this.router.navigate(['auth', 'login']);

		this.subs.sink = this.actions$
			.pipe(
				ofActionCompleted(IsAuthenticated),
				tap(() => {
					isAuthenticated.next(true);
					isAuthenticated.complete();
				})
			)
			.subscribe();

		this.isAuthenticatedDispatcher();

		return this.isAuthenticated$.pipe(
			takeUntil(isAuthenticated),
			map((authenticated) => {
				if (authenticated) return true;

				this.router.navigate(['auth', 'login']);

				return false;
			})
		);
	}
}
