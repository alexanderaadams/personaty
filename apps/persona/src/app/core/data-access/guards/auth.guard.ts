import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { UnsubscribeOnDestroyAdapter } from '@persona/shared';
import { IAuthStateModel, FormService } from '@persona/authentication';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard
	extends UnsubscribeOnDestroyAdapter
	implements CanActivate
{
	@Select('auth')
	isAuthenticated$!: Observable<IAuthStateModel>;

	constructor(private formService: FormService) {
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
