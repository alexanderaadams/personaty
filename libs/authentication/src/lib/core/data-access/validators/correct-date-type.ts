import { Injectable } from '@angular/core';
import {
	AbstractControl,
	AsyncValidator,
	ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Moment } from 'moment';


@Injectable({
	providedIn: 'root',
})
export class CorrectDateType implements AsyncValidator {


	validate = (
		control: AbstractControl
	): Observable<ValidationErrors | null> => {
		const { value } = control;


		return of(null);
	};
}
