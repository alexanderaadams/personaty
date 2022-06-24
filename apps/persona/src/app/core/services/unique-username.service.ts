import { Injectable } from '@angular/core';
import {
	AbstractControl,
	AsyncValidator,
	ValidationErrors,
} from '@angular/forms';
import { map, catchError } from 'rxjs/operators';
import { from, Observable, of, EMPTY, throwError } from 'rxjs';

import { SharedService } from '@persona/shared';

@Injectable({
	providedIn: 'root',
})
export class UniqueUsername implements AsyncValidator {
	constructor(private sharedService: SharedService) {}

	validate = (
		control: AbstractControl
	): Observable<ValidationErrors | null> => {
		console.log(control);
		const { value } = control;

		return this.sharedService.checkUserAvailable({ username: value }).pipe(
			catchError((err) => {
				// control.setErrors({ nonUniqueUsername: true });
				// console.log(err);
				return EMPTY;
				// if (err?.error?.username) {
				// 	return from(of({ nonUniqueUsername: true }));
				// } else {
				// 	return from(of({ noConnection: true }));
				// }
			}),
			map((value) => {
				if (value?.available) return null;

				return of(control.setErrors({ nonUniqueUsername: true }));
			})
		);
	};
}
