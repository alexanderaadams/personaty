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

@Injectable({
	providedIn: 'root',
})
export class UniqueEmail implements AsyncValidator {
	constructor(private authService: AuthService) {}

	validate = (
		control: AbstractControl
	): Observable<ValidationErrors | null> => {
		const { value } = control;

		return this.authService.userAvailable({ email: value }).pipe(
			map((value) => {
				return value;
			}),
			catchError((err) => {
				console.log(err);
				return of({ noConnection: true });
			})
		);
	};
}
