import { StorageEngine } from '@ngxs/storage-plugin';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class MyStorageEngineService implements StorageEngine {
	get length(): number {
		return localStorage.length;
	}

	getItem(key: string): Observable<any> {
		return of(localStorage.getItem(key));
	}

	setItem(key: string, val: any): void {
		of(localStorage.setItem(key, val));
	}

	removeItem(key: string): void {
		localStorage.removeItem(key);
	}

	clear(): void {
		localStorage.clear();
	}

	key(val: number): Observable<any> {
		return of(localStorage.key(val));
	}
}
