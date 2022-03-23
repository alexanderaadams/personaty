import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ForgotPassword, Signup } from '../../store/auth.actions';

@Component({
	selector: 'lib-email-token',
	templateUrl: './email-token.component.html',
	styleUrls: ['./email-token.component.scss'],
})
export class EmailTokenComponent {
	@Input() authForm!: { authForm: any; status: 'signup' | 'forgotPassword' };
	@Input() header!: string;
	@Output() dismiss = new EventEmitter();

	constructor(private store: Store, private router: Router) {}

	onDismissClick() {
		this.dismiss.emit();
		// console.log(this.dismiss.emit());
	}

	sendEmail() {
		const { authForm, status } = this.authForm;

		// console.log(authForm, status);

		if (authForm?.invalid) {
			return;
		}

		if (status === 'signup')
			this.store.dispatch(new Signup(authForm.value)).subscribe({
				next: () => {
					this.router.navigateByUrl('/home');
				},
				error: (err) => {
					return;
				},
			});

		if (status === 'forgotPassword') {
			this.store.dispatch(new ForgotPassword(authForm.value)).subscribe({
				next: () => {
					this.router.navigateByUrl('auth/login');
				},
				error: (err) => {
					return;
				},
			});

			// console.log(this.authForm);
		}
	}
}
