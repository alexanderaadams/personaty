import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { ResetPassword } from '../store/auth.actions';
import { MatchPassword } from '../validators/match-password';

@Component({
	selector: 'lib-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
	showModal = false;
	authForm: FormGroup = new FormGroup(
		{
			password: new FormControl('', [Validators.required]),

			confirmPassword: new FormControl('', [Validators.required]),
		},
		this.matchPassword.validate
	);

	constructor(
		private store: Store,
		private matchPassword: MatchPassword,
		private activatedRoute: ActivatedRoute,
		private router: Router
	) {}

	onSubmit() {
		if (this.authForm?.invalid || !this.authForm.value) {
			console.log(this.authForm);
			this.showModal = true;
			return this.authForm.setErrors({ invalid: true });
		}

		this.activatedRoute.params
			.pipe(
				tap((data) => {
					this.store
						.dispatch(
							new ResetPassword({
								...this.authForm.value,
								token: data['token'],
							})
						)
						.subscribe({
							next: (response) => {
								this.router.navigateByUrl('/auth/login');
							},
							error: ({ error }) => {
								this.authForm.setErrors({ credentialsError: true });
							},
						});
				})
			)
			.subscribe();

		// .subscribe({
		// 	next: (response) => {
		// 	this.router.navigateByUrl('');
		// 	},
		// 		error: ({ error }) => {
		// 			this.authForm.setErrors({ credentials: true });
		// 		},
		// 	});

		console.log(this.authForm.value);
	}
	inputFormControl(option: string): FormControl {
		return this.authForm?.get(option) as FormControl;
	}
}
