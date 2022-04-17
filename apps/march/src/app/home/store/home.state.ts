import { GetStories } from './home.action';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

import { Action, State, StateContext, Selector } from '@ngxs/store';

import { HomeService } from '../home.service';
import { UnsubscribeOnDestroyAdapter } from '@march/authentication';

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
