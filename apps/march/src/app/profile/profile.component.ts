import { ProfileService } from './profile.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Select, Store, Actions } from '@ngxs/store';
import { GetUserInfo } from './store/profile.action';
import { UnsubscribeOnDestroyAdapter } from '@march/authentication';
import { ProfileState } from './store/profile.state';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProfileStateModel } from './store/profile.model';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
// import { colors } from '../core/colors';
@Component({
	selector: 'march-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnInit
{
	backendUrl = environment.BACKEND_URL;
	createStory = new BehaviorSubject(false);

	storyForm = new FormGroup({
		title: new FormControl('', [Validators.required]),

		description: new FormControl('', [Validators.required]),

		category: new FormControl([''], [Validators.required]),
	});

	@Select(ProfileState.userInfo)
	user$!: Observable<ProfileStateModel>;

	id = this.activatedRoute.snapshot.params['id'];

	constructor(
		private store: Store,
		private activatedRoute: ActivatedRoute,
		private actions$: Actions,
		private profileService: ProfileService
	) {
		super();
	}

	ngOnInit(): void {
		this.store.dispatch(new GetUserInfo(this.id));
	}

	onCreateStory() {
		this.createStory.next(true);
	}

	onCancelStory() {
		this.createStory.next(false);
	}
}
