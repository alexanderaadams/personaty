import { Injectable } from '@angular/core';
import { tap, take } from 'rxjs/operators';
import { Action, State, StateContext, Selector } from '@ngxs/store';

import { GetUserInfo } from './profile.action';
import { ProfileService } from '../services/profile.service';
import { IProfileStateModel } from './profile.model';

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
export class ProfileState {
	@Selector()
	static userInfo(userInfo: IProfileStateModel) {
		return userInfo;
	}

	constructor(private profileService: ProfileService) {}

	@Action(GetUserInfo)
	getUserInfo(ctx: StateContext<IProfileStateModel>, action: GetUserInfo) {
		this.profileService
			.getUserInfo(action.payload)
			.pipe(
				tap((res) => {
					ctx.patchState(res);
				}),
				take(1)
			)
			.subscribe();
	}
}
