import { Injectable } from '@angular/core';
import {
	AbstractControl,
	AsyncValidator,
	ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';

import { Moment } from 'moment';

import { AuthService } from '../services/auth.service';

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
