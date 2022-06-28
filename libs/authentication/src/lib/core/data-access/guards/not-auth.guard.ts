import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { FormService } from '../services/form.service';

@Injectable({
	providedIn: 'root',
})
export class NotAuthGuard implements CanActivate {
	constructor(private formService: FormService) {}

	canActivate():
		| boolean
		| UrlTree
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree> {
		this.formService.checkIfAlreadyAuthenticated();

		return true;
	}
}
