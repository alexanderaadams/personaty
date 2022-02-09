import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthService } from '../auth.service';
import { Login, LoginWithGoogle } from '../store/auth.actions';

@Component({
	selector: 'lib-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
	googleApi = '';

	authForm: FormGroup = new FormGroup({
		username: new FormControl(''),

		password: new FormControl(''),
	});
	constructor(
		private store: Store,
		private router: Router,
		private authService: AuthService
	) {}
	onSubmit() {
		if (this.authForm?.invalid) {
			console.log(this.authForm);
			return;
		}

		this.store.dispatch(new Login(this.authForm.value)).subscribe({
			next: (response) => {
				this.router.navigateByUrl('/home');
			},
			error: ({ error }) => {
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

	lognWithGoogle() {
		this.store.dispatch(new LoginWithGoogle()).subscribe({
			next: (response) => {
				console.log(response);
				// this.router.navigate(response);
			},
			error: ({ error }) => {
				this.authForm.setErrors({ credentialsError: true });
			},
			complete() {
				return;
			},
		});
	}
}
