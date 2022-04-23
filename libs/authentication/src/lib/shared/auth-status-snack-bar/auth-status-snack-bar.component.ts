import { Component } from '@angular/core';

@Component({
	selector: 'lib-auth-status-snack-bar',
	template: `
		<span class="  d-flex justify-content-around align-items-center">
			<p
				style="color: var(--bs-red);"
				class="d-flex justify-content-center align-items-center "
			>
				Please try again
			</p>
			<button mat-flat-button color="primary" class="">dismiss</button></span
		>
	`,
	styleUrls: ['./auth-status-snack-bar.component.scss'],
})
export class AuthStatusSnackBarComponent {}
