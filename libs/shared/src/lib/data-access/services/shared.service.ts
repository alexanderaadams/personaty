import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SharedService {
	loginExecutingLoader$: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(false);

	isBrowser: boolean;

	constructor(
		@Inject(PLATFORM_ID) private platformId: Record<string, unknown>
	) {
		this.isBrowser = isPlatformBrowser(this.platformId);
	}
}
