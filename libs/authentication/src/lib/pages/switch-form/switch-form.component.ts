import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LoginWithGoogle } from '@auth/core/data-access/state/auth.action';
import { Store } from '@ngxs/store';

@Component({
	selector: 'lib-switch-form',
	templateUrl: './switch-form.component.html',
	styleUrls: ['./switch-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchFormComponent {
	@Input() sentence!: string;
	@Input() switchToForm!: string;

	constructor(private readonly store: Store) {}

	loginWithGoogle() {
		this.store.dispatch(new LoginWithGoogle());
	}

	loginWithFacebook() {
		return;
	}

	showErrors(formControl: FormControl) {
		const { dirty, touched, errors } = formControl;
		return dirty && touched && errors;
	}
}
