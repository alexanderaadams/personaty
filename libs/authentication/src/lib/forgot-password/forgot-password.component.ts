import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ForgotPassword } from '../store/auth.actions';

@Component({
	selector: 'lib-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
	forgotPassword = false;
	authForm: FormGroup = new FormGroup({
		email: new FormControl(''),
	});

	constructor(private store: Store, private router: Router) {}

	onSubmit() {
		this.store.dispatch(new ForgotPassword(this.authForm.value)).subscribe({
			next: (response) => {
				this.router.navigateByUrl('');
			},
			error: (err) => {
				this.authForm.setErrors({ credentialsError: true });
			},
			complete() {
				return;
			},
		});
	}

	inputFormControl(option: string): FormControl {
		return this.authForm?.get(option) as FormControl;
	}
}
