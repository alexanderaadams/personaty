import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SharedService } from '@persona/shared';

@Component({
	selector: 'lib-oauth2-success',
	templateUrl: './oauth2-success.component.html',
	styleUrls: ['./oauth2-success.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Oauth2SuccessComponent implements OnInit {
	// isBrowser: BehaviorSubject<boolean> = this.sharedService.isBrowser;

	constructor(private sharedService: SharedService) {}

	ngOnInit(): void {
		setTimeout(() => {
			if (this.sharedService.isBrowser.value) window.close();
		}, 2000);
	}
}
