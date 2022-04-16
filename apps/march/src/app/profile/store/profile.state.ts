import { GetUserInfo } from './profile.action';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

import { Action, State, StateContext, Selector } from '@ngxs/store';

import { ProfileService } from '../profile.service';
import { ProfileStateModel } from './profile.model';
import { UnsubscribeOnDestroyAdapter } from '@march/authentication';

@State<ProfileStateModel>({
	name: 'profile',
	defaults: {
		fullName: null,

		username: null,

		profilePicture: null,

		created_at: null,

		stories: null,

		bio: null,

		tags: null,
	},
})
@Injectable()
export class ProfileState extends UnsubscribeOnDestroyAdapter {
	// private querySubscription!: Subscription;

	@Selector()
	static userInfo(userInfo: ProfileStateModel) {
		return userInfo;
	}

	constructor(private profileService: ProfileService) {
		super();
	}

	@Action(GetUserInfo)
	getUserInfo(ctx: StateContext<ProfileStateModel>, action: GetUserInfo) {
		this.subs.sink = this.profileService
			.getUserInfo(action.payload)
			.pipe(
				tap((res) => {
					ctx.patchState(res);
				})
			)
			.subscribe();
	}
}
