import {
	Component,
	OnDestroy,
	OnInit,
	ChangeDetectionStrategy,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Moment } from 'moment';

import { FormService } from '@auth/core/data-access/services/form.service';
import { IAuthStateModel } from '@auth/core/data-access/store/auth.model';
import { AuthState } from '@auth/core/data-access/store/auth.state';
import {
	LoginWithGoogle,
	Signup,
} from '@auth/core/data-access/store/auth.action';
import {
	UnsubscribeOnDestroyAdapter,
	environment,
	SharedService,
} from '@persona/shared';

@Component({
	selector: 'lib-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnDestroy, OnInit
{
	hide = true;

	@Select(AuthState.isAuthenticated)
	isAuthenticated$!: Observable<IAuthStateModel>;

	authForm: FormGroup = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),

		password: new FormControl('', [
			Validators.required,
			Validators.minLength(environment.MIN_LENGTH),
			Validators.maxLength(environment.MAX_LENGTH),
		]),

		birthDate: new FormControl('', [Validators.required]),
	});

	constructor(
		private readonly store: Store,
		private formService: FormService,
		public readonly sharedService: SharedService
	) {
		super();
	}

	ngOnInit() {
		this.subs.sink = this.formService
			.followAuthenticationStatus(
				Signup,
				'Failed to signup... Please check your information',
				'Email has been send successfully... check your email address'
			)
			.subscribe();
	}

	onSubmit() {
		if (this.authForm?.invalid || !this.authForm.value) {
			return this.authForm.setErrors({ invalid: true });
		}

		const { email, password } = this.authForm.value;

		const birthDate: Moment = this.authForm
			.get('birthDate')
			?.value.format('YYYY-MM-DD');

		const formValue = { birthDate: birthDate.toString(), email, password };

		this.formService.formValue$.next(formValue);

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

		this.formService.goAuthenticate(new Signup(formValue));
	}

	// inputFormControl(option: string): FormControl {
	// 	return this.authForm?.get(option) as FormControl;
	// }

	loginWithGoogle() {
		this.store.dispatch(new LoginWithGoogle());
	}

	loginWithFacebook() {
		//
	}

	// showErrors(control: any) {
	// 	const { dirty, touched } = control;
	// 	return dirty && touched;
	// }
}
