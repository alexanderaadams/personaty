import { IsAuthenticatedService } from './is-authenticated.service';
import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';

import { BehaviorSubject, map, Observable, takeUntil, tap } from 'rxjs';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { UnsubscribeOnDestroyAdapter } from '../shared/unsubscribe-on-destroy.adapter';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { AuthState } from '../store/auth.state';
import { IsAuthenticated } from '../store/auth.action';

@Injectable({
	providedIn: 'root',
})
export class NotAuthGuard
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
		const isAuthenticated = new BehaviorSubject<boolean>(false);

		const authenticated = this.store.selectSnapshot(AuthState.isAuthenticated);

		if (authenticated) return this.router.navigate(['']);

		this.subs.sink = this.actions$
			.pipe(
				ofActionCompleted(IsAuthenticated),
				tap(() => {
					isAuthenticated.next(true);
					isAuthenticated.complete();
				})
			)
			.subscribe();

		this.store.dispatch(new IsAuthenticated());

		return this.isAuthenticated$.pipe(
			takeUntil(isAuthenticated),
			map((authenticated) => {
				if (!authenticated) return true;

				this.router.navigate(['']);

				return false;
			})
		);
	}
}
