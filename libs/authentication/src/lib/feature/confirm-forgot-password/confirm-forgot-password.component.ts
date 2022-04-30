import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap, take } from 'rxjs/operators';

import { ConfirmForgotPassword } from '../../data-access/store/auth.action';
import { MatchPassword } from '../../data-access/validators/match-password';
import { FormService } from '../../shared/data-access/services/form.service';
import { UnsubscribeOnDestroyAdapter } from '../../shared/unsubscribe-on-destroy.adapter';

@Component({
	selector: 'lib-confirm-forgot-password',
	templateUrl: './confirm-forgot-password.component.html',
	styleUrls: ['./confirm-forgot-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmForgotPasswordComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnInit
{
	hide = true;

	loginExecutingLoader$: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(false);

	authForm: FormGroup = new FormGroup(
		{
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(8),
			]),

			confirmPassword: new FormControl('', [
				Validators.required,
				Validators.minLength(8),
			]),
		},
		{ validators: [this.matchPassword.validate] }
	);

	constructor(
		private matchPassword: MatchPassword,
		private activatedRoute: ActivatedRoute,
		private formService: FormService
	) {
		super();
	}

	ngOnInit() {
		this.formService.followAuthenticationStatus(
			ConfirmForgotPassword,
			'Failed to confirm your new password',
			'Password has been changed successfully'
		);
	}

	onSubmit() {
		if (this.authForm?.invalid || !this.authForm.value) {
			return this.authForm.setErrors({ invalid: true });
		}

		const token: string = this.activatedRoute.snapshot.params['token'];

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

		this.loginExecutingLoader$ = this.formService.loginExecutingLoader$;

		this.formService.goAuthenticate(
			new ConfirmForgotPassword({
				...this.authForm.value,
				token,
			})
		);
	}
	// inputFormControl(option: string): FormControl {
	// 	return this.authForm?.get(option) as FormControl;
	// }
}
