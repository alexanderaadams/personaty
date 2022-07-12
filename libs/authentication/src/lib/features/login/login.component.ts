import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';

import { FormService } from '@auth/core/data-access/services/form.service';
import {
	Login,
	LoginWithGoogle,
} from '@auth/core/data-access/state/auth.action';
import { IAuthStateModel } from '@auth/core/data-access/state/auth.model';
import { SwitchFormComponent } from '../../pages/switch-form/switch-form.component';
import {
	SharedService,
	UnsubscribeOnDestroyAdapter,
	environment,
} from '@persona/shared';

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
	login = 'Login';
	hide = true;
	followAuthenticationStatus = {
		action: Login,
		toastFailedMessage: 'Failed to Login',
		toastSuccessMessage: 'Logged in successfully',
	};

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
		private formService: FormService,
		public readonly sharedService: SharedService,
		public readonly switchFormComponent: SwitchFormComponent
	) {
		super();
	}

	ngOnInit() {
		this.subs.sink = this.formService
			.followAuthenticationStatus(
				Login,
				'Failed to Login',
				'Logged in successfully'
			)
			.subscribe();

		console.log(this.authForm?.['controls']);
	}

	onSubmit() {
		console.log(this.authForm?.['controls']?.['email']);
		if (this.authForm.invalid || !this.authForm.value)
			return this.authForm.setErrors({ invalid: true });

		this.formService.value$.next(this.authForm.value);

		this.formService.value$
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

	showErrors(option: string) {
		const formControl = this.authForm?.get(option) as FormControl;
		return this.switchFormComponent.showErrors(formControl);
	}

	// 	formControl(option: string): FormControl {
	// 	return this.authForm?.get(option) as FormControl;
	// }
}
