import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Select, Store, Actions } from '@ngxs/store';

import { ProfileService } from '../data-access/services/profile.service';
import { GetUserInfo } from '../data-access/store/profile.action';
import { ProfileState } from '../data-access/store/profile.state';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { IProfileStateModel } from '../data-access/store/profile.model';
import { FormService } from '@persona/authentication';
import { UnsubscribeOnDestroyAdapter, environment } from '@persona/shared';

@Component({
	selector: 'persona-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnInit
{
	backendUrl: string = environment.BACKEND_URL;
	createStory = new BehaviorSubject(false);

	date = new Date(1546108200 * 1000);
	user$: Observable<IProfileStateModel> = of({
		fullName: 'jimy dore',

		username: 'jimy-ee',

		profilePicture: 'https://ss',

		created_at: null,

		stories: [
			{
				_id: '1',

				category: [
					{ text: 'ss', color: '#fff' },
					{ text: 'ss', color: '#fff' },
				],

				StoryImageUrl: 'sss',

				created_at: null,

				user_id: '11',
			},
		],

		bio: { text: 'sddddddddddddddddddddddddddddd', color: '#fff' },

		interests: [
			{ text: 'ssssss', color: '#fff' },
			{ text: 'ssssss', color: '#fff' },
		],
	});

	id = this.activatedRoute.snapshot.params['id'];

	constructor(
		private store: Store,
		private activatedRoute: ActivatedRoute,
		private actions$: Actions,
		private profileService: ProfileService,
		private router: Router,
		private formService: FormService
	) {
		super();
	}

	ngOnInit(): void {
		this.store.dispatch(new GetUserInfo(this.id));
	}

	onCreateStory() {
		this.router.navigate(['story', this.id]);
		// this.createStory.next(true);
	}

	onCancelStory() {
		// this.createStory.next(false);
	}
}
