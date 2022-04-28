import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';

import { Login, LoginWithGoogle } from '../../data-access/store/auth.action';
import { AuthStateModel } from '../../data-access/store/auth.model';
import { FormService } from '../../shared/data-access/services/form.service';
import { UnsubscribeOnDestroyAdapter } from '../../shared/unsubscribe-on-destroy.adapter';

@Component({
	selector: 'lib-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnInit
{
	hide = true;

	loginExecutingLoader$ = new BehaviorSubject<boolean>(false);

	@Select('auth')
	isAuthenticated$!: Observable<AuthStateModel>;

	authForm: FormGroup = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),

		password: new FormControl('', [
			Validators.required,
			Validators.minLength(8),
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
		this.formService.followAuthenticationStatus(
			Login,
			'Failed to Login, Please Try Again',
			'Logged in successfully'
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
