import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'march-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	constructor(private readonly router: Router) {}

	ngOnInit(): void {}

	logout() {
		this.router.navigateByUrl('auth/logout');
	}
}
