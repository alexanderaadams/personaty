import { Injectable } from '@angular/core';
import { Validator, FormGroup, AbstractControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class MatchPassword implements Validator {
	validate(formGroup: AbstractControl) {
		const { password, passwordConfirmation } = formGroup.value;

		if (password === passwordConfirmation) {
			return null;
		} else {
			return { passwordsDontMatch: true };
		}
	}
}
