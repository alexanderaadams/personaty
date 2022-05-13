import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'persona-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	constructor(private readonly router: Router) {}

	logout() {
		this.router.navigate(['auth', 'logout']);
	}
}
