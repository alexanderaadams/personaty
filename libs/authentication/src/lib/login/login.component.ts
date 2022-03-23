import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Login, LoginWithGoogle } from '../store/auth.actions';
import { Observable, tap } from 'rxjs';
import { AuthStateModel } from '../store/auth.model';

@Component({
	selector: 'lib-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
	showModal = false;

	@Select('Auth')
	status$!: Observable<AuthStateModel>;

	authForm: FormGroup = new FormGroup({
		email: new FormControl('', [Validators.required]),

		password: new FormControl('', [Validators.required]),
	});

	constructor(
		private store: Store,
		private router: Router,
		private readonly changeDetectorRef: ChangeDetectorRef
	) {}

	onSubmit() {
		if (this.authForm?.invalid || !this.authForm.value) {
			// console.log(this.authForm);
			this.showModal = true;
			return this.authForm.setErrors({ invalid: true });
		}

		this.store.dispatch(new Login(this.authForm.value)).subscribe({
			next: () => {
				this.status$
					.pipe(
						tap(({ authenticated }) => {
							if (!authenticated) {
								this.authForm.setErrors({ invalid: true });
								this.showModal = true;
							}

							if (authenticated === true) {
								this.router.navigateByUrl('/home');
							}
							console.log(authenticated);
						})
					)
					.subscribe();
			},
			error: (err) => {
				this.authForm.setErrors({ invalid: true });
			},
		});

		// console.log(this.authForm);
	}

	inputFormControl(option: string): FormControl {
		return this.authForm?.get(option) as FormControl;
	}

	loginWithGoogle() {
		this.store.dispatch(new LoginWithGoogle());
	}

	ngAfterViewChecked(): void {
		this.changeDetectorRef.detectChanges();
	}
}
