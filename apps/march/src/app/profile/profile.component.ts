import { ProfileService } from './profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Select, Store, Actions } from '@ngxs/store';
import { GetUserInfo } from './store/profile.action';
import {
	FormService,
	UnsubscribeOnDestroyAdapter,
} from '@march/authentication';
import { ProfileState } from './store/profile.state';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProfileStateModel } from './store/profile.model';

import { environment } from '../../environments/environment';

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

	@Select(ProfileState.userInfo)
	user$!: Observable<ProfileStateModel>;

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
