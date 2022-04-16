import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UniqueEmail } from '../validators/unique-email';
import { Select, Store } from '@ngxs/store';
import { LoginWithGoogle, Signup } from '../store/auth.action';
import { Observable, tap, Subscription } from 'rxjs';
import { AuthStateModel } from '../store/auth.model';

import { AuthState } from '../store/auth.state';
import { UnsubscribeOnDestroyAdapter } from '../shared/unsubscribe-on-destroy.adapter';
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
			Validators.minLength(2),
			Validators.maxLength(30),
		]),

		birthDate: new FormControl('', [
			Validators.required,
			Validators.pattern(
				/^([0-9]{4})-?(1[0-2]|0[1-9])-?(3[01]|0[1-9]|[12][0-9])$/
			),
		]),
	});

	constructor(
		private store: Store,
		private uniqueEmail: UniqueEmail,
		private router: Router,
		private readonly changeDetectorRef: ChangeDetectorRef
	) {
		super();
	}

	onSubmit() {
		if (this.authForm?.invalid || !this.authForm.value) {
			return this.authForm.setErrors({ invalid: true });
		}

		this.subs.sink = this.store.dispatch(new Signup(this.authForm.value)).subscribe({
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
