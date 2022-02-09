import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'lib-success',
	templateUrl: './success.component.html',
	styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit {
	ngOnInit(): void {
		setTimeout(() => {
			window.close();
		}, 1000);
	}
}
