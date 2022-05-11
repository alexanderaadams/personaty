import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { UnsubscribeOnDestroyAdapter } from '../../unsubscribe-on-destroy.adapter';

@Injectable({
	providedIn: 'root',
})
export class SharedService extends UnsubscribeOnDestroyAdapter {
	loginExecutingLoader$: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(false);

	isBrowser: boolean;

	constructor(
		@Inject(PLATFORM_ID) private platformId: Record<string, unknown>
	) {
		super();
		this.isBrowser = isPlatformBrowser(platformId);
	}
}
