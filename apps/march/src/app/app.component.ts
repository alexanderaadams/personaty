import { MyStorageEngineService } from '@march/authentication';
import { Component, OnDestroy } from '@angular/core';

@Component({
	selector: 'march-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
	constructor(private myStorageEngineService: MyStorageEngineService) {}

	ngOnDestroy() {
		this.myStorageEngineService.removeItem('auth');
	}
}
