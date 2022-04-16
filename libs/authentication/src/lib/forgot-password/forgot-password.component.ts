import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ForgotPassword } from '../store/auth.action';

@Component({
	selector: 'lib-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
	authForm: FormGroup = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),
	});

	constructor(private store: Store, private router: Router) {}

	onSubmit() {
		if (this.authForm.invalid || !this.authForm.value)
			return this.authForm.setErrors({ invalid: true });

		this.store.dispatch(new ForgotPassword(this.authForm.value));

		this.router.navigate(['auth', 'login']);
	}

	inputFormControl(option: string): FormControl {
		return this.authForm?.get(option) as FormControl;
	}
}
