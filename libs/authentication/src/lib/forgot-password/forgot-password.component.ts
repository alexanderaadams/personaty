import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ForgotPassword } from '../store/auth.actions';

@Component({
	selector: 'lib-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
	showModal = false;
	emailToken!: any;

	authForm: FormGroup = new FormGroup({
		email: new FormControl('', [
			Validators.required,
			Validators.pattern(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			),
		]),
	});

	constructor(private store: Store, private router: Router) {}

	onSubmit() {
		if (this.authForm?.invalid || !this.authForm.value) {
			this.showModal = true;
			return this.authForm.setErrors({ invalid: true });
		}

		this.emailToken = { authForm: this.authForm, status: 'forgotPassword' };
		this.showModal = true;
	}

	// sendEmail() {
	// 	this.emailToken = { authForm: this.authForm, status: 'forgotPassword' };
	// }

	inputFormControl(option: string): FormControl {
		return this.authForm?.get(option) as FormControl;
	}
}
