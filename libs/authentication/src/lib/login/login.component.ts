import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Actions, Select, Store } from '@ngxs/store';
import { Login, LoginWithGoogle } from '../store/auth.action';
import { Observable } from 'rxjs';
import { AuthStateModel } from '../store/auth.model';
import { UnsubscribeOnDestroyAdapter } from '../shared/unsubscribe-on-destroy.adapter';
import { AuthState } from '../store/auth.state';

@Component({
	selector: 'lib-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends UnsubscribeOnDestroyAdapter {
	hide = true;

	@Select(AuthState.isAuthenticated)
	isAuthenticated$!: Observable<AuthStateModel>;

	authForm: FormGroup = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),

		password: new FormControl('', [
			Validators.required,
			Validators.minLength(2),
		]),
	});

	constructor(
		private readonly store: Store,
		private readonly router: Router,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly actions$: Actions
	) {
		super();
	}

	onSubmit() {
		if (this.authForm?.invalid || !this.authForm.value) {
			return this.authForm.setErrors({ invalid: true });
		}

		this.subs.sink = this.isAuthenticated$.subscribe({
			next: (authenticated) => {
				console.log(authenticated);

				if (authenticated) this.router.navigate(['']);
			},
		});

		this.store.dispatch(new Login(this.authForm.value));
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
}
