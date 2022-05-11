import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormService } from '../../features/core/data-access/form.service';

@Component({
	selector: 'lib-oauth2-success',
	templateUrl: './oauth2-success.component.html',
	styleUrls: ['./oauth2-success.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Oauth2SuccessComponent implements OnInit {
	isBrowser: boolean = this.formService.isBrowser;

	constructor(private formService: FormService) {}

	ngOnInit(): void {
		setTimeout(() => {
			if (this.isBrowser) window.close();
		}, 2000);
	}
}
