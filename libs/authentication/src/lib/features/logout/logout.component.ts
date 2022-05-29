import { Observable, BehaviorSubject } from 'rxjs';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';

import { AuthState } from '@auth/core/data-access/store/auth.state';
import { FormService } from '@auth/core/data-access/services/form.service';
import { Logout } from '@auth/core/data-access/store/auth.action';
import { UnsubscribeOnDestroyAdapter } from '@persona/shared';

@Component({
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

	constructor(private formService: FormService) {
		super();
	}

	ngOnInit() {
		this.subs.sink = this.formService
			.followAuthenticationStatus(
				Logout,
				'Failed to Logout..., Please Try Again',
				'Logged out successfully'
			)
			.subscribe();

		this.formService.goAuthenticate(new Logout());
	}
}
