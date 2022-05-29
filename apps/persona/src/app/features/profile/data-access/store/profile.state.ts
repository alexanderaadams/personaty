import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Action, State, StateContext, Selector } from '@ngxs/store';

import { GetUserInfo } from './profile.action';
import { ProfileService } from '../services/profile.service';
import { IProfileStateModel } from './profile.model';
import { UnsubscribeOnDestroyAdapter } from '@persona/shared';

@State<IProfileStateModel>({
	name: 'profile',

	defaults: {
		fullName: null,

		username: null,

		profilePicture: null,

		created_at: null,

		stories: null,

		bio: null,

		interests: null,
	},
})
@Injectable()
export class ProfileState extends UnsubscribeOnDestroyAdapter {
	@Selector()
	static userInfo(userInfo: IProfileStateModel) {
		return userInfo;
	}

	constructor(private profileService: ProfileService) {
		super();
	}

	@Action(GetUserInfo)
	getUserInfo(ctx: StateContext<IProfileStateModel>, action: GetUserInfo) {
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
