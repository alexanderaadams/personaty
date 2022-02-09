/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UniqueEmail } from '../validators/unique-email';
import { UniqueUser } from '../validators/unique-username';
import { Store } from '@ngxs/store';
import { Signup } from '../store/auth.actions';

@Component({
	selector: 'lib-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
	authForm: FormGroup = new FormGroup({
		username: new FormControl(
			'',
			[
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(20),
				Validators.pattern(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/),
			],
			[this.uniqueUsername.validate]
		),
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
			Validators.minLength(2),
			Validators.maxLength(20),
		]),
	});

	constructor(
		private store: Store,
		private uniqueUsername: UniqueUser,
		private uniqueEmail: UniqueEmail,
		private router: Router
	) {}

	onSubmit() {
		if (this.authForm?.invalid) {
			console.log(this.authForm);
			return;
		}
		this.store.dispatch(new Signup(this.authForm.value)).subscribe({
			next: (response) => {
				this.router.navigateByUrl('/home');
			},
			error: (err) => {
				if (!err.status) {
					this.authForm.setErrors({ noConnection: true });
				} else {
					this.authForm.setErrors({ unknownError: true });
				}
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
