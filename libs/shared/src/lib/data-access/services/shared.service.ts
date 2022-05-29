import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SharedService {
	executingLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
		false
	);

	isBrowser: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	isServer: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(
		@Inject(PLATFORM_ID) private platformId: Record<string, unknown>
	) {
		this.isBrowser.next(isPlatformBrowser(this.platformId));
		this.isServer.next(isPlatformServer(this.platformId));
	}
}
