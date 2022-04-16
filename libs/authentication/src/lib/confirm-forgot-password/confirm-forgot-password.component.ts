import { UnsubscribeOnDestroyAdapter } from '../shared/unsubscribe-on-destroy.adapter';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs';
import { ConfirmForgotPassword } from '../store/auth.action';
import { MatchPassword } from '../validators/match-password';

@Component({
	selector: 'lib-confirm-forgot-password',
	templateUrl: './confirm-forgot-password.component.html',
	styleUrls: ['./confirm-forgot-password.component.scss'],
})
export class ConfirmForgotPasswordComponent extends UnsubscribeOnDestroyAdapter {
	hide = true;

	authForm: FormGroup = new FormGroup(
		{
			password: new FormControl('', [
				Validators.required,
				Validators.maxLength(2),
			]),

			confirmPassword: new FormControl('', [
				Validators.required,
				Validators.maxLength(2),
			]),
		},
		{ validators: [this.matchPassword.validate] }
	);

	constructor(
		private store: Store,
		private matchPassword: MatchPassword,
		private activatedRoute: ActivatedRoute,
		private router: Router
	) {
		super();
	}

	onSubmit() {
		if (this.authForm?.invalid || !this.authForm.value) {
			return this.authForm.setErrors({ invalid: true });
		}

		const token = this.activatedRoute.snapshot.params['token'];

		this.store.dispatch(
			new ConfirmForgotPassword({
				...this.authForm.value,
				token,
			})
		);

		this.router.navigate(['auth', 'login']);
	}
	// inputFormControl(option: string): FormControl {
	// 	return this.authForm?.get(option) as FormControl;
	// }
}
