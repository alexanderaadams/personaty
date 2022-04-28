import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';

import { UnsubscribeOnDestroyAdapter } from '../../shared/unsubscribe-on-destroy.adapter';
import { FormService } from '../../shared/data-access/services/form.service';
import { AuthStateModel } from '../../data-access/store/auth.model';
import { AuthState } from '../../data-access/store/auth.state';
import { LoginWithGoogle, Signup } from '../../data-access/store/auth.action';

import { Moment } from 'moment';

@Component({
	selector: 'lib-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss'],
})
export class SignupComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnDestroy, OnInit
{
	hide = true;
	loginExecutingLoader$ = new BehaviorSubject<boolean>(false);

	@Select(AuthState.isAuthenticated)
	isAuthenticated$!: Observable<AuthStateModel>;

	authForm = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),

		password: new FormControl('', [
			Validators.required,
			Validators.minLength(8),
			Validators.maxLength(30),
		]),

		birthDate: new FormControl('', [Validators.required]),
	});

	constructor(
		private store: Store,
		private router: Router,
		private formService: FormService
	) {
		super();
	}

	ngOnInit() {
		this.formService.followAuthenticationStatus(
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

		this.loginExecutingLoader$ = this.formService.loginExecutingLoader$;

		this.formService.goAuthenticate(
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
