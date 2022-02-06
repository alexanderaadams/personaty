import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'lib-signout',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.scss'],
})
export class SignoutComponent {
	constructor(private router: Router) {}
}
