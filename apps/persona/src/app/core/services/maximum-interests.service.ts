import { Injectable } from '@angular/core';
import {
	AbstractControl,
	AsyncValidator,
	ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class MaximumInterests implements AsyncValidator {
	validate = (
		control: AbstractControl
	): Observable<ValidationErrors | null> => {
		const { value } = control;

		// console.log(this.chips);

		if (value < 10) return of(null);

		// control.setErrors({ valid: false });

		return of({ valid: false });
	};
}
