import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'lib-oauth2-success',
	templateUrl: './oauth2-success.component.html',
	styleUrls: ['./oauth2-success.component.scss'],
})
export class Oauth2SuccessComponent implements OnInit {
	ngOnInit(): void {
		setTimeout(() => {
			window.close();
		}, 2000);
	}
}
