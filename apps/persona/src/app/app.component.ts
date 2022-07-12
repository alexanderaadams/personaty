import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { SharedService } from '@persona/shared';
import { AuthState } from '@persona/authentication';

import { AppService } from './app.service';

@Component({
	selector: 'persona-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
	@Select(AuthState.userId)
	userId$!: Observable<string>;
	// executingLoader$!: BehaviorSubject<boolean>;

	constructor(
		private readonly appService: AppService,
		private readonly sharedService: SharedService
	) {}

	get executingLoader$() {
		return this.sharedService.executingLoader$.asObservable();
	}

	ngOnInit(): void {
		this.appService.getCsrfToken();

		// this.executingLoader$ = this.sharedService.executingLoader$;
	}
}
