import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SharedService } from '@persona/shared';

import { AppService } from './app.service';

@Component({
	selector: 'persona-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	executingLoader$!: BehaviorSubject<boolean>;
	constructor(
		private appService: AppService,
		public sharedService: SharedService
	) {}

	ngOnInit(): void {
		this.appService.getCsrfToken();

		this.executingLoader$ = this.sharedService.executingLoader$;
	}
}
