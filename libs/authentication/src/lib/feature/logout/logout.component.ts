import { Observable } from 'rxjs';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';

import { UnsubscribeOnDestroyAdapter } from '../../shared/unsubscribe-on-destroy.adapter';
import { AuthState } from '../../data-access/store/auth.state';
import { FormService } from '../../shared/data-access/services/form.service';
import { Logout } from '../../data-access/store/auth.action';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'lib-signout',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
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
		private formService: FormService
	) {
		super();
	}

	ngOnInit() {
		this.formService.followAuthenticationStatus(
			Logout,
			'Failed to Logout, Please Try Again',
			'Logged out successfully'
		);

		this.formService.goAuthenticate(new Logout());
	}
}
