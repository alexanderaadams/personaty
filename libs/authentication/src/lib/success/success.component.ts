import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'lib-success',
	templateUrl: './success.component.html',
	styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit {
	constructor(private readonly router: Router) {}

	ngOnInit(): void {
		window.close();
		this.router.navigateByUrl('/home');
	}
}
