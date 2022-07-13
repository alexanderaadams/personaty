import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-bottts-sprites';

import { UnsubscribeOnDestroyAdapter, environment } from '@persona/shared';
import { ProfileState } from '@features/profile/data-access/state/profile.state';
import { StoriesState } from '@features/stories/data-access/state/stories.state';
import { IStoriesStateModel } from '@features/stories/data-access/state/stories.model';
import { ImageService } from '@core/services/image.service';

import { GetUser } from '../../data-access/state/profile.action';
import { IProfileStateModel } from '../../data-access/state/profile.model';

@Component({
	selector: 'persona-profile',
	templateUrl: './show-profile.component.html',
	styleUrls: ['./show-profile.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowProfileComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnInit
{
	@Select(ProfileState.value)
	user$!: Observable<IProfileStateModel>;

	svg = createAvatar(style, {
		seed: 'custom-seed',
		base64: true,
		// ... and other options
	});

	@Select(StoriesState.value)
	stories$!: Observable<Array<IStoriesStateModel>>;

	backendUrl: string = environment.BACKEND_URL;
	createStory = new BehaviorSubject(false);
	profilePicture$ = new BehaviorSubject<
		string | ArrayBuffer | null | undefined
	>(null);
	profileCover$ = new BehaviorSubject<string | ArrayBuffer | null | undefined>(
		null
	);

	userId = this.activatedRoute.snapshot.params['userId'];

	constructor(
		private readonly store: Store,
		private readonly activatedRoute: ActivatedRoute,
		private readonly imageService: ImageService,
		private readonly navCtrl: NavController
	) {
		super();
	}

	ngOnInit(): void {
		this.store.dispatch(new GetUser(this.userId));

		this.subs.sink = this.user$.subscribe((user) => {
			this.svg = createAvatar(style, {
				seed: user.fullName ?? 'custom-seed',
				base64: true,
				// ... and other options
			});

			if (user.profilePicture)
				this.subs.sink = this.imageService
					.getImage(this.userId, user.profilePicture)
					.subscribe((image) => {
						this.profilePicture$.next(image);
					});

			if (user.profileCover)
				this.subs.sink = this.imageService
					.getImage(this.userId, user.profileCover)
					.subscribe((image) => {
						this.profileCover$.next(image);
					});
		});
	}

	editProfile() {
		this.navCtrl.navigateForward(['/', 'profile', this.userId, 'update']);
	}
}
