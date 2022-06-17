import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SharedService } from '@persona/shared';
import { BehaviorSubject } from 'rxjs';
import { GetCsrfToken } from './core/data-access/store/app.action';

@Component({
	selector: 'persona-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	executingLoader$!: BehaviorSubject<boolean>;
	constructor(private store: Store, public sharedService: SharedService) {}

	ngOnInit(): void {
		this.store.dispatch(new GetCsrfToken());

		this.executingLoader$ = this.sharedService.executingLoader$;
	}
}
