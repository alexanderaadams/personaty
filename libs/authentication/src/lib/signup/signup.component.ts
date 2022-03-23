/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UniqueEmail } from '../validators/unique-email';
import { Select, Store } from '@ngxs/store';
import { LoginWithGoogle, Signup } from '../store/auth.actions';
import { catchError, Observable, of, Subject, tap } from 'rxjs';
import { AuthStateModel } from '../store/auth.model';

@Component({
	selector: 'lib-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
	showModal = false;

	@Select('Auth')
	status$!: Observable<AuthStateModel>;

	emailToken!: any;

	authForm = new FormGroup({
		email: new FormControl('', [
			Validators.required,
			Validators.pattern(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			),
		]),
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
	) {}

	onSubmit() {
		if (this.authForm?.invalid || !this.authForm.value) {
			// console.log(this.authForm);
			this.showModal = true;
			return this.authForm.setErrors({ invalid: true });
		}

		this.store.dispatch(new Signup(this.authForm.value)).subscribe({
			next: () => {
				this.status$
					.pipe(
						tap(({ authenticated }) => {
							if (authenticated === false) this.showModal = true;
							{
								this.authForm.setErrors({ invalid: true });
								this.showModal = true;
							}

							if (authenticated === null) {
								this.showModal = true;
								this.emailToken = { authForm: this.authForm, status: 'signup' };
							}
							// console.log(authenticated);
						})
					)
					.subscribe();
			},
			error: (err) => {
				this.authForm.setErrors({ invalid: true });
			},
		});

		// console.log(this.authForm);
	}

	inputFormControl(option: string): FormControl {
		return this.authForm?.get(option) as FormControl;
	}

	loginWithGoogle() {
		this.store.dispatch(new LoginWithGoogle());
	}

	ngAfterViewChecked(): void {
		this.changeDetectorRef.detectChanges();
	}
}
