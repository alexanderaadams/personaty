import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Actions, Select, Store } from '@ngxs/store';
import {
	UnsubscribeOnDestroyAdapter,
	FormService,
	AuthStateModel,
} from '@persona/authentication';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard
	extends UnsubscribeOnDestroyAdapter
	implements CanActivate
{
	@Select('auth')
	isAuthenticated$!: Observable<AuthStateModel>;

	constructor(
		private store: Store,
		private actions$: Actions,
		private router: Router,
		private formService: FormService
	) {
		super();
	}

	canActivate():
		| boolean
		| UrlTree
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree> {
		this.formService.checkIfAlreadyAuthenticated();

		return true;
	}
}
