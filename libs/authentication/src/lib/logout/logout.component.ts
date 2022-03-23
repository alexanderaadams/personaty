import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CookieService } from 'ngx-cookie-service';
import { Logout } from '../store/auth.actions';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'lib-signout',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {
	showModal = false;

	constructor(private store: Store, private router: Router) {
		this.store.dispatch(new Logout()).subscribe({
			next: () => {
				// this.router.navigateByUrl('/auth/login');
			},
			error: (err) => {
				this.showModal = true;
				setTimeout(() => {
					this.router.navigateByUrl('/auth/login');
				}, 1000);
			},
		});
	}
}
