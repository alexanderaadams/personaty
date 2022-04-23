import { IsAuthenticatedService } from './../shared/is-authenticated.service';
import { Observable } from 'rxjs';
import { UnsubscribeOnDestroyAdapter } from '../shared/unsubscribe-on-destroy.adapter';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Logout } from '../store/auth.action';
import { AuthState } from '../store/auth.state';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'lib-signout',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnInit
{
	@Select(AuthState.isAuthenticated)
	isAuthenticated$!: Observable<boolean>;

	constructor(
		private store: Store,
		private router: Router,
		private isAuthenticatedService: IsAuthenticatedService
	) {
		super();
	}

	ngOnInit() {
		this.isAuthenticatedService.checkActionStatus(
			Logout,
			'Failed to Logout, Please Try Again',
			'Logged out successfully'
		);

		this.isAuthenticatedService.goAuthenticate(new Logout());
	}
}
