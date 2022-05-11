import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetCsrfToken } from './core/data-access/store/app.action';

@Component({
	selector: 'persona-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	constructor(private store: Store) {}

	ngOnInit() {
		this.store.dispatch(new GetCsrfToken());
	}
}
