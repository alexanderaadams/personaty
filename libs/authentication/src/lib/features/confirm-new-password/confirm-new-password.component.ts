import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tap, take } from 'rxjs/operators';

import { ConfirmForgotPassword } from '@auth/core/data-access/state/auth.action';
import { MatchPassword } from '@auth/core/data-access/validators/match-password';
import { FormService } from '@auth/core/data-access/services/form.service';
import { SwitchFormComponent } from '../../pages/switch-form/switch-form.component';
import {
	SharedService,
	UnsubscribeOnDestroyAdapter,
	environment,
} from '@persona/shared';

@Component({
	selector: 'lib-confirm-new-password',
	templateUrl: './confirm-new-password.component.html',
	styleUrls: ['./confirm-new-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmNewPasswordComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnInit
{
	hideNewPassword = true;
	hideConfirmPassword = true;

	authForm: FormGroup = new FormGroup(
		{
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(environment.MIN_LENGTH),
				Validators.maxLength(environment.MAX_LENGTH),
			]),

			confirmPassword: new FormControl('', [
				Validators.required,
				Validators.minLength(environment.MIN_LENGTH),
				Validators.maxLength(environment.MAX_LENGTH),
			]),
		},
		{ validators: [this.matchPassword.validate] }
	);

	constructor(
		private readonly matchPassword: MatchPassword,
		private readonly activatedRoute: ActivatedRoute,
		private readonly formService: FormService,
		public readonly sharedService: SharedService,
		private readonly switchFormComponent: SwitchFormComponent
	) {
		super();
	}

	ngOnInit() {
		this.subs.sink = this.formService
			.followAuthenticationStatus(
				ConfirmForgotPassword,
				'Failed to confirm your new password',
				'Password has been changed successfully'
			)
			.subscribe();
	}

	onSubmit() {
		if (this.authForm?.invalid || !this.authForm.value) {
			return this.authForm.setErrors({ invalid: true });
		}

		const authToken: string = this.activatedRoute.snapshot.params['authToken'];

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

		this.formService.goAuthenticate(
			new ConfirmForgotPassword({
				...this.authForm.value,
				authToken,
			})
		);
	}
	showErrors(option: string) {
		const formControl = this.authForm?.get(option) as FormControl;
		return this.switchFormComponent.showErrors(formControl);
	}
	// inputFormControl(option: string): FormControl {
	// 	return this.authForm?.get(option) as FormControl;
	// }
}
