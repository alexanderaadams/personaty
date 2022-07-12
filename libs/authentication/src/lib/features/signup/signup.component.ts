import {
	Component,
	OnDestroy,
	OnInit,
	ChangeDetectionStrategy,
	ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Moment } from 'moment';

import { FormService } from '@auth/core/data-access/services/form.service';
import { IAuthStateModel } from '@auth/core/data-access/state/auth.model';
import { AuthState } from '@auth/core/data-access/state/auth.state';
import { Signup } from '@auth/core/data-access/state/auth.action';
import {
	UnsubscribeOnDestroyAdapter,
	environment,
	SharedService,
} from '@persona/shared';
import { SwitchFormComponent } from '@auth/pages/switch-form/switch-form.component';
import { IonDatetime, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

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
	birthDate = new BehaviorSubject<string>('Select your birthday');

	@Select(AuthState.isAuthenticated)
	isAuthenticated$!: Observable<IAuthStateModel>;

	@ViewChild(IonModal) modal!: IonModal;

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
		private formService: FormService,
		public readonly sharedService: SharedService,
		private readonly switchFormComponent: SwitchFormComponent
	) {
		super();
	}

	ngOnInit() {
		this.subs.sink = this.formService
			.followAuthenticationStatus(
				Signup,
				'Failed to signup',
				'Email has been send successfully'
			)
			.subscribe();
	}

	onSubmit() {
		console.log(this.authForm.value);
		if (this.authForm?.invalid || !this.authForm.value) {
			return this.authForm.setErrors({ invalid: true });
		}

		this.formService.value$.next(this.authForm.value);

		this.formService.value$
			.pipe(
				tap((value: unknown | null) => {
					if (!value) {
						this.authForm.reset();
					}
				}),
				take(2)
			)
			.subscribe();

		this.formService.goAuthenticate(new Signup(this.authForm.value));
	}

	showErrors(option: string) {
		const formControl = this.authForm?.get(option) as FormControl;
		return this.switchFormComponent.showErrors(formControl);
	}
	// inputFormControl(option: string): FormControl {
	// 	return this.authForm?.get(option) as FormControl;
	// }

	// showErrors(control: any) {
	// 	const { dirty, touched } = control;
	// 	return dirty && touched;
	// }

	cancel() {
		this.modal.dismiss(null, 'cancel');
	}

	confirm(dateTime: IonDatetime) {
		this.authForm.controls['birthDate'].patchValue(dateTime.value);

		this.modal.dismiss(this.authForm.value['birthDate'], 'confirm');
		console.log(this.authForm.value['birthDate']);
	}

	onWillDismiss(event: Event) {
		const ev = event as CustomEvent<OverlayEventDetail<string>>;
		if (ev.detail.role === 'confirm') {
			console.log(ev.detail);
			this.birthDate.next(ev.detail?.data ?? 'Select your birthday');
			// this.message = `Hello, ${ev.detail.data}!`;
		}
	}
}
