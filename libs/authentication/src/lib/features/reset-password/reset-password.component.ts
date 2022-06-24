import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap, take } from 'rxjs/operators';

import { SendForgotPasswordEmail } from '@auth/core/data-access/state/auth.action';
import { FormService } from '@auth/core/data-access/services/form.service';
import { SharedService, UnsubscribeOnDestroyAdapter } from '@persona/shared';

@Component({
	selector: 'lib-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnInit
{
	authForm: FormGroup = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),
	});

	constructor(
		private formService: FormService,
		public readonly sharedService: SharedService
	) {
		super();
	}

	ngOnInit() {
		this.subs.sink = this.formService
			.followAuthenticationStatus(
				SendForgotPasswordEmail,
				'Failed to Forgot Password',
				'Email has been send successfully'
			)
			.subscribe();
	}

	onSubmit() {
		if (this.authForm.invalid || !this.authForm.value)
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

		this.formService.goAuthenticate(
			new SendForgotPasswordEmail(this.authForm.value)
		);
	}
}
