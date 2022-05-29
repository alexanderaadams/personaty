import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { tap, take } from 'rxjs/operators';

import { SendForgotPasswordEmail } from '@auth/core/data-access/store/auth.action';
import { FormService } from '@auth/core/data-access/services/form.service';
import { SharedService, UnsubscribeOnDestroyAdapter } from '@persona/shared';

@Component({
	selector: 'lib-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent
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
				'Failed to Forgot Password... Please Try Again',
				'Email has been send successfully... Please Check your email address'
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
