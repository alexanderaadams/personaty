import { HttpClient } from '@angular/common/http';
import { FormService } from '../shared/form.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { Login, LoginWithGoogle } from '../store/auth.action';
import { AuthStateModel } from '../store/auth.model';
import { UnsubscribeOnDestroyAdapter } from '../shared/unsubscribe-on-destroy.adapter';

@Component({
	selector: 'lib-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends UnsubscribeOnDestroyAdapter {
	hide = true;

	loginExecutingLoader$ = new BehaviorSubject<boolean>(false);

	@Select('auth')
	isAuthenticated$!: Observable<AuthStateModel>;

	authForm: FormGroup = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),

		password: new FormControl('', [
			Validators.required,
			Validators.minLength(2),
		]),
	});

	constructor(
		private readonly store: Store,
		private formService: FormService,
		private http: HttpClient //
	) {
		super();
	}

	ngOnInit() {
		this.formService.checkAuthenticationStatus(
			Login,
			'Failed to Login, Please Try Again',
			'Check your email'
		);
	}

	onSubmit() {
		if (this.authForm?.invalid || !this.authForm.value) {
			return this.authForm.setErrors({ invalid: true });
		}

		this.loginExecutingLoader$ = this.formService.loginExecutingLoader$;

		this.formService.goAuthenticate(new Login(this.authForm.value));
	}

	inputFormControl(option: string): FormControl {
		return this.authForm?.get(option) as FormControl;
	}

	loginWithGoogle() {
		this.store.dispatch(new LoginWithGoogle());
	}

	loginWithFacebook() {
		//
	}
}
/*
async@latest portscanner@latest browser-sync@latest @nguniversal/builders@latest nth-check@latest css-select@latest cheerio@latest inline-css@latest @nestjs-modules/mailer@latest list-stylesheets@latest extract-css@latest style-data@latest
*/
