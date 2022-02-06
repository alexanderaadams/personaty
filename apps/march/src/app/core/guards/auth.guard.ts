import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { AuthState } from '@march/authentication';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanLoad {
	constructor(private store: Store) {}
	canLoad(
		route: Route,
		segments: UrlSegment[]
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		const isAuthenticated = this.store.selectSnapshot(
			AuthState.isAuthenticated
		);
		return isAuthenticated;
	}
}
