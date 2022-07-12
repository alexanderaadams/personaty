import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormService } from '@auth/core/data-access/services/form.service';
import { Logout } from '@auth/core/data-access/state/auth.action';
import { take } from 'rxjs/operators';

@Component({
	selector: 'lib-signout',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent implements OnInit {
	constructor(private formService: FormService) {}

	ngOnInit() {
		this.formService
			.followAuthenticationStatus(
				Logout,
				'Failed to Logout',
				'Logged out successfully'
			)
			.pipe(take(1))
			.subscribe();

		this.formService.goAuthenticate(new Logout());
	}
}
