import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, tap } from 'rxjs';

import { LoginWithGoogle, Signup } from '../store/auth.action';
import { AuthStateModel } from '../store/auth.model';
import { AuthState } from '../store/auth.state';
import { UnsubscribeOnDestroyAdapter } from '../shared/unsubscribe-on-destroy.adapter';

import * as _moment from 'moment';
import { Moment } from 'moment';

const moment = _moment;

@Component({
	selector: 'lib-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss'],
})
export class SignupComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnDestroy
{
	hide = true;

	@Select(AuthState.isAuthenticated)
	isAuthenticated$!: Observable<AuthStateModel>;

	// Validators.pattern(
	// 	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	// )
	authForm = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),

		password: new FormControl('', [
			Validators.required,
			Validators.minLength(8),
			Validators.maxLength(30),
		]),

		birthDate: new FormControl(moment('1995-09-09', 'YYYY-MM-DD'), [
			Validators.required,
		]),
	});

	constructor(
		private store: Store,

		private router: Router
	) {
		super();
	}

	onSubmit() {
		if (this.authForm?.invalid || !this.authForm.value) {
			return this.authForm.setErrors({ invalid: true });
		}

		const { email, password } = this.authForm.value;

		const birthDate: Moment = this.authForm
			.get('birthDate')
			?.value.format('YYYY-MM-DD');
		// console.log({ birthDate, email, password });

		this.subs.sink = this.store
			.dispatch(
				new Signup({ birthDate: birthDate.toString(), email, password })
			)
			.subscribe({
				next: () => {
					this.subs.sink = this.isAuthenticated$
						.pipe(
							tap((authenticated) => {
								if (!authenticated) this.authForm.setErrors({ invalid: true });
							})
						)
						.subscribe();
				},
				error: () => {
					this.authForm.setErrors({ invalid: true });
				},
			});
	}

	inputFormControl(option: string): FormControl {
		return this.authForm?.get(option) as FormControl;
	}

	loginWithGoogle() {
		this.store.dispatch(new LoginWithGoogle());
	}

	loginWithFacebook() {
		//
	}

	// showErrors(control: any) {
	// 	const { dirty, touched } = control;
	// 	return dirty && touched;
	// }
}
