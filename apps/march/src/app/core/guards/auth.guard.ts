import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';

import { map, Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { AuthStateModel } from '@march/authentication';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanLoad {
	@Select('Auth')
	status!: Observable<AuthStateModel>;

	constructor(private store: Store) {}
	canLoad(
		route: Route,
		segments: UrlSegment[]
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		return this.status.pipe(
			map(({ authenticated }) => {
				if (!authenticated) return false;

				return true;
			})
		);
	}
}
