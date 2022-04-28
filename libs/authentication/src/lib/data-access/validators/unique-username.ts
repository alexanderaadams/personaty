// import { Injectable } from '@angular/core';
// import {
// 	AbstractControl,
// 	AsyncValidator,
// 	FormControl,
// 	ValidationErrors,
// } from '@angular/forms';
// import { map, catchError } from 'rxjs/operators';
// import { Observable, of } from 'rxjs';

// import { AuthService } from '../auth.service';

// @Injectable({
// 	providedIn: 'root',
// })
// export class UniqueUser implements AsyncValidator {
// 	constructor(private authService: AuthService) {}

// 	validate = (
// 		control: AbstractControl
// 	): Observable<ValidationErrors | null> => {
// 		const { value } = control;

// return this.authService.userAvailable({ username: value }).pipe(
// 	map((value) => {
// 		if (value?.available) return null;

// 		throw new Error('Username is not available');
// 	}),
// 	catchError((err) => {
// 		return of({ nonUniqueUsername: true });
// 	})
// );
// 	};
// }
