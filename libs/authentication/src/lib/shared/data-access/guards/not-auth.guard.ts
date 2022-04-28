import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { Observable } from 'rxjs';
import { AuthState } from '../../../data-access/store/auth.state';
import { UnsubscribeOnDestroyAdapter } from '../../unsubscribe-on-destroy.adapter';


import { FormService } from '../services/form.service';

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
		const authenticated = this.store.selectSnapshot(AuthState.isAuthenticated);

		if (!authenticated) return true;

		this.formService.checkIfAlreadyAuthenticated();

		return this.router.navigate(['']);
	}
}
