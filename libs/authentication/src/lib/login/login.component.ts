import { UniqueUser } from './../validators/unique-username';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Login, LoginWithGoogle } from '../store/auth.actions';

@Component({
	selector: 'lib-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
	authForm: FormGroup = new FormGroup({
		username: new FormControl(''),

		password: new FormControl(''),
	});

	constructor(
		private store: Store,
		private router: Router,
		private uniqueUser: UniqueUser,
		private readonly changeDetectorRef: ChangeDetectorRef
	) {}

	onSubmit() {
		if (this.authForm?.invalid || !this.authForm.value) {
			console.log(this.authForm);
			return;
		}

		this.store.dispatch(new Login(this.authForm.value)).subscribe({
			next: (response) => {
				this.router.navigateByUrl('/home');
			},
			error: ({ error }) => {
				this.authForm.setErrors({ credentialsError: true });
				console.log(error, this.authForm);
			},
		});
	}

	inputFormControl(option: string): FormControl {
		return this.authForm?.get(option) as FormControl;
	}

	loginWithGoogle() {
		this.store.dispatch(new LoginWithGoogle()).subscribe({
			next: (response) => {
				console.log(response);
				// this.router.navigate(response);
			},
			error: ({ error }) => {
				this.authForm.setErrors({ credentialsError: true });
			},
			complete() {
				return;
			},
		});
	}

	ngAfterViewChecked(): void {
		this.changeDetectorRef.detectChanges();
	}
}
