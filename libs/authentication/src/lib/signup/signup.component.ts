/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit, SimpleChanges } from '@angular/core';
import {
	AbstractControl,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { UniqueEmail } from '../validators/unique-email';
import { UniqueUser } from '../validators/unique-username';
import { Store } from '@ngxs/store';
import { LoginWithGoogle, Signup } from '../store/auth.actions';

@Component({
	selector: 'lib-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
	authForm = new FormGroup({
		email: new FormControl(
			'',
			[
				Validators.required,
				Validators.pattern(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				),
			],
			[this.uniqueEmail.validate]
		),
		password: new FormControl('', [
			Validators.required,
			Validators.minLength(1),
			Validators.maxLength(30),
		]),

		date: new FormControl('', [
			Validators.required,
			Validators.pattern(
				/^([0-9]{4})-?(1[0-2]|0[1-9])-?(3[01]|0[1-9]|[12][0-9])$/
			),
		]),
	});

	constructor(
		private store: Store,
		private uniqueEmail: UniqueEmail,
		private router: Router
	) {}

	onSubmit() {
		if (this.authForm?.invalid) {
			console.log(this.authForm.value);
			return this.authForm.setErrors({ invalid: true });
		}

		this.store.dispatch(new Signup(this.authForm.value)).subscribe({
			next: (response) => {
				// this.router.navigateByUrl('/home');
			},
			error: (err) => {
				console.log(err);
				this.authForm.setErrors({ credentialsError: true });
			},
		});
	}

	inputFormControl(option: string): FormControl {
		return this.authForm?.get(option) as FormControl;
	}

	showErrors() {
		const { dirty, touched } = this.authForm;
		return dirty && touched;
	}

	loginWithGoogle() {
		this.store.dispatch(new LoginWithGoogle()).subscribe({
			next: (response) => {
				console.log(response);
			},
			error: ({ error }) => {
				this.authForm.setErrors({ credentialsError: true });
			},
		});
	}
}
