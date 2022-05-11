import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { FormService } from '@persona/authentication';

@Component({
	selector: 'persona-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	constructor(
		private readonly router: Router,
		private store: Store,
		private formService: FormService
	) {}

	logout() {
		this.router.navigate(['auth', 'logout']);
	}
}
