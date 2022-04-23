import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginWithGoogle, Signup } from '../store/auth.action';
import { AuthStateModel } from '../store/auth.model';
import { AuthState } from '../store/auth.state';
import { UnsubscribeOnDestroyAdapter } from '../shared/unsubscribe-on-destroy.adapter';

import * as _moment from 'moment';
import { Moment } from 'moment';
import { IsAuthenticatedService } from '../shared/is-authenticated.service';

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
	loginExecutingLoader$ = new BehaviorSubject<boolean>(false);

	@Select(AuthState.isAuthenticated)
	isAuthenticated$!: Observable<AuthStateModel>;

	authForm = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),

		password: new FormControl('', [
			Validators.required,
			Validators.minLength(2),
			Validators.maxLength(30),
		]),

		birthDate: new FormControl('', [Validators.required]),
	});

	constructor(
		private store: Store,
		private router: Router,
		private isAuthenticatedService: IsAuthenticatedService
	) {
		super();
	}

	ngOnInit() {
		this.isAuthenticatedService.checkActionStatus(
			Signup,
			'Failed to signup, Please Try Again',
			'Check your email'
		);
	}

	onSubmit() {
		if (this.authForm?.invalid || !this.authForm.value) {
			return this.authForm.setErrors({ invalid: true });
		}

		const { email, password } = this.authForm.value;

		const birthDate: Moment = this.authForm
			.get('birthDate')
			?.value.format('YYYY-MM-DD');

		this.loginExecutingLoader$ =
			this.isAuthenticatedService.loginExecutingLoader$;

		this.isAuthenticatedService.goAuthenticate(
			new Signup({ birthDate: birthDate.toString(), email, password })
		);
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
