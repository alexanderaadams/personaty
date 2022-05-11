import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { Observable } from 'rxjs';
import { AuthState } from '../store/auth.state';
import { UnsubscribeOnDestroyAdapter } from '../../shared/unsubscribe-on-destroy.adapter';

import { FormService } from '../../features/core/data-access/form.service';

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
