import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { Observable } from 'rxjs';
import { AuthState } from '../store/auth.state';

import { FormService } from '../services/form.service';
import { UnsubscribeOnDestroyAdapter } from '@persona/shared';

@Injectable({
	providedIn: 'root',
})
export class NotAuthGuard
	extends UnsubscribeOnDestroyAdapter
	implements CanActivate
{
	constructor(
		private store: Store,
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
		const authenticated: boolean = this.store.selectSnapshot(
			AuthState.isAuthenticated
		);

		this.formService.checkIfAlreadyAuthenticated();

		if (authenticated) return this.router.navigate(['']);

		return true;

		// return this.router.navigate(['']);
	}
}
