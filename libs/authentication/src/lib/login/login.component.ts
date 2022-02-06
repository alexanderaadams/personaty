import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthService } from '../auth.service';
import { Login, Signup } from '../store/auth.actions';

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
		private authService: AuthService
	) {}
	onSubmit() {
		if (this.authForm?.invalid) {
			console.log(this.authForm);
			return;
		}

		this.store.dispatch(new Login(this.authForm.value)).subscribe({
			next: (response) => {
				this.router.navigateByUrl('');
			},
			error: ({ error }) => {
				this.authForm.setErrors({ credentials: true });
			},
		});

		this.authService.getAllUser();
	}
	inputFormControl(option: string): FormControl {
		return this.authForm?.get(option) as FormControl;
	}
}
