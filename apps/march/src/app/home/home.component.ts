import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormService } from '@march/authentication';
import { Store } from '@ngxs/store';
import { GetUserInfo } from '../profile/store/profile.action';

@Component({
	selector: 'march-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	constructor(
		private readonly router: Router,
		private store: Store,
		private formService: FormService
	) {}

	ngOnInit(): void {
		// this.store.dispatch(new GetHomeInfo());
		// this.formService.CheckIfAlreadyAuthenticated();
	}

	logout() {
		this.router.navigate(['auth', 'logout']);
	}
}
