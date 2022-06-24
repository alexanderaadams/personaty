import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class IndexedDbService {
	openDatabase(name: string, version: number) {
		let result;
		// Let us open our database
		const request = window.indexedDB.open(name, version);

		request.onerror = (event) => {
			// Do something with request.errorCode!
		};
		request.onsuccess = (event) => {
			// result = event?.target?.result;
			// Do something with request.result!
		};

		return request.result;
	}
}
