import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';

import { UnsubscribeOnDestroyAdapter } from '@persona/shared';
import { GetStories } from './home.action';
import { HomeService } from '../services/home.service';
import { HomeStateModel } from './home.model';

@State<HomeStateModel>({
	name: 'home',
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

	// @Selector()
	// static stories(userInfo: ProfileStateModel) {
	// 	return userInfo;
	// }

	constructor(private homeService: HomeService) {
		super();
	}

	@Action(GetStories)
	getUserInfo(ctx: StateContext<HomeStateModel>, action: GetStories) {
		// this.subs.sink = this.homeService
		// 	.getUserInfo(action.payload)
		// 	.pipe(
		// 		tap((res) => {
		// 			ctx.patchState(res);
		// 		})
		// 	)
		// 	.subscribe();
	}
}
