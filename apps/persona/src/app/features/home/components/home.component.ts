import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '@core/services/image.service';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-bottts-sprites';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';

import { ProfileState } from '@features/profile/data-access/state/profile.state';
import { IProfileStateModel } from '@features/profile/data-access/state/profile.model';
import { GetUser } from '@features/profile/data-access/state/profile.action';
import { AuthState } from '@persona/authentication';
import { UnsubscribeOnDestroyAdapter } from '@persona/shared';

@Component({
	selector: 'persona-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnInit
{
	@Select(AuthState.userId)
	userId$!: Observable<string>;

	@Select(ProfileState.value)
	user$!: Observable<IProfileStateModel>;

	@Select(AuthState.isAuthenticated)
	authenticated$!: Observable<boolean>;

	iconType = new BehaviorSubject<'light' | 'dark'>('light');
	profilePicture$ = new BehaviorSubject<
		string | ArrayBuffer | null | undefined
	>(null);
	svg = createAvatar(style, {
		seed: 'custom-seed',
		base64: true,
		// ... and other options
	});

	constructor(
		private readonly router: Router,
		private readonly store: Store,
		private readonly imageService: ImageService
	) {
		super();
	}

	ngOnInit() {
		this.subs.sink = this.userId$.subscribe((userId) => {
			if (userId) {
				this.store.dispatch(new GetUser(userId));
				this.getUser();
			}
		});
	}

	getUser() {
		this.subs.sink = this.user$.subscribe((user) => {
			this.svg = createAvatar(style, {
				seed: user.fullName ?? 'custom-seed',
				base64: true,
				// ... and other options
			});

			if (user.profilePicture && user.id)
				this.subs.sink = this.imageService
					.getImage(user.id, user.profilePicture)
					.subscribe((image) => {
						this.profilePicture$.next(image);
					});
		});
	}

	async changeTheme() {
		if (document.querySelector('body')?.classList.contains('dark')) {
			this.iconType.next('dark');
			document.querySelector('body')?.classList.remove('dark');
			return document.querySelector('body')?.classList.add('light');
		}
		this.iconType.next('light');
		document.querySelector('body')?.classList.remove('light');
		return document.querySelector('body')?.classList.add('dark');
	}
}
