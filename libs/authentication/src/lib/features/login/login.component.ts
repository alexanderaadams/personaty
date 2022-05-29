import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';

import { environment } from '@auth/core/environment.prod';
import { FormService } from '@auth/core/data-access/services/form.service';
import {
	Login,
	LoginWithGoogle,
} from '@auth/core/data-access/store/auth.action';
import { IAuthStateModel } from '@auth/core/data-access/store/auth.model';
import { SharedService, UnsubscribeOnDestroyAdapter } from '@persona/shared';

@Component({
	selector: 'lib-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnInit
{
	hide = true;

	@Select('auth')
	isAuthenticated$!: Observable<IAuthStateModel>;

	authForm: FormGroup = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),

		password: new FormControl('', [
			Validators.required,
			Validators.minLength(environment.MIN_LENGTH),
			Validators.maxLength(environment.MAX_LENGTH),
		]),
	});

	constructor(
		private readonly store: Store,
		private formService: FormService,
		public readonly sharedService: SharedService
	) {
		super();
	}

	ngOnInit() {
		this.subs.sink = this.formService
			.followAuthenticationStatus(
				Login,
				'Failed to Login... Please check your information',
				'Logged in successfully'
			)
			.subscribe();
	}

	onSubmit() {
		if (this.authForm?.invalid || !this.authForm.value)
			return this.authForm.setErrors({ invalid: true });

		this.formService.formValue$.next(this.authForm.value);

		this.formService.formValue$
			.pipe(
				tap((value: unknown | null) => {
					if (!value) {
						this.authForm.reset();
					}
				}),
				take(2)
			)
			.subscribe();

		this.formService.goAuthenticate(new Login(this.authForm.value));
	}

	// inputFormControl(option: string): FormControl {
	// 	return this.authForm?.get(option) as FormControl;
	// }

	loginWithGoogle() {
		this.store.dispatch(new LoginWithGoogle());
	}

	loginWithFacebook() {
		//
	}
}
