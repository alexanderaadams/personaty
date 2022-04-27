import { Component, OnInit } from '@angular/core';
import { FormService } from '../shared/form.service';

@Component({
	selector: 'lib-oauth2-success',
	templateUrl: './oauth2-success.component.html',
	styleUrls: ['./oauth2-success.component.scss'],
})
export class Oauth2SuccessComponent implements OnInit {
	isBrowser = this.formService.isBrowser;

	constructor(private formService: FormService) {}

	ngOnInit(): void {
		setTimeout(() => {
			if (this.isBrowser) window.close();
		}, 2000);
	}
}
