import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';

import { SendForgotPasswordEmail } from '../../data-access/store/auth.action';
import { FormService } from '../../shared/data-access/services/form.service';

@Component({
	selector: 'lib-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit {
	loginExecutingLoader$: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(false);

	authForm: FormGroup = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),
	});

	constructor(
		private store: Store,
		private router: Router,
		private formService: FormService
	) {}

	ngOnInit() {
		this.formService.followAuthenticationStatus(
			SendForgotPasswordEmail,
			'Failed to Forgot Password, Please Try Again',
			'Please Check your Email Address'
		);
	}

	onSubmit() {
		if (this.authForm.invalid || !this.authForm.value)
			return this.authForm.setErrors({ invalid: true });

		this.loginExecutingLoader$ = this.formService.loginExecutingLoader$;

		this.formService.goAuthenticate(
			new SendForgotPasswordEmail(this.authForm.value)
		);
	}
}