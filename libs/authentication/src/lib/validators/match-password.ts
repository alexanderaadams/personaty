import { Injectable } from '@angular/core';
import { Validator, FormGroup, AbstractControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class MatchPassword implements Validator {
	validate(formGroup: AbstractControl) {
		const { password, confirmPassword } = formGroup.value;

		if (password === confirmPassword) {
			return null;
		} else {
			return { passwordsDontMatch: true };
		}
	}
}
