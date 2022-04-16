import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { GetUserInfo } from '../profile/store/profile.action';

@Component({
	selector: 'march-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	constructor(private readonly router: Router, private store: Store) {}

	ngOnInit(): void {
		this.store
			.dispatch(new GetUserInfo('624dbc17d348902015bae0df'))
			.subscribe();
	}

	logout() {
		console.log('log');
		this.router.navigate(['auth', 'logout']);
	}
}
