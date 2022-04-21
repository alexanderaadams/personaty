import { Injectable } from '@angular/core';
import {
	AbstractControl,
	AsyncValidator,
	FormControl,
	ValidationErrors,
} from '@angular/forms';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { AuthService } from '../auth.service';
import { Moment } from 'moment';

@Injectable({
	providedIn: 'root',
})
export class CorrectDateType implements AsyncValidator {
	constructor(private authService: AuthService) {}

	validate = (
		control: AbstractControl
	): Observable<ValidationErrors | null> => {
		const { value } = control;

		const birthDate: Moment = value.format('YYYY-MM-DD');
		console.log(birthDate);

		return of(null);
	};
}
