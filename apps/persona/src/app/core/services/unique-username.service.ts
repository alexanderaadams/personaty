import { Injectable } from '@angular/core';
import {
	AbstractControl,
	AsyncValidator,
	ValidationErrors,
} from '@angular/forms';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Observable, of, EMPTY } from 'rxjs';

import { SharedService } from '@persona/shared';

@Injectable({
	providedIn: 'root',
})
export class UniqueUsername implements AsyncValidator {
	constructor(private sharedService: SharedService) {}

	validate = (
		control: AbstractControl
	): Observable<ValidationErrors | null> => {
		const { value } = control;

		if (!value) return of(null);

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
			switchMap((value) => {
				if (value?.available) return of(null);

				// control.setErrors({ nonUniqueUsername: true });
				return of({ nonUniqueUsername: true });
			})
		);
	};
}
