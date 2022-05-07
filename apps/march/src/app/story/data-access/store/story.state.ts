import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Action, State, StateContext, Selector } from '@ngxs/store';

import { UnsubscribeOnDestroyAdapter } from '@march/authentication';

import { StoryStateModel } from './story.model';
import { CreateStory, GetStory } from './story.action';
import { StoryService } from '../services/story.service';

@State<StoryStateModel>({
	name: 'story',
	defaults: {
		_id: null,

		category: null,

		StoryImageUrl: null,

		created_at: null,

		user_id: null,
	},
})
@Injectable()
export class StoryState extends UnsubscribeOnDestroyAdapter {
	// private querySubscription!: Subscription;

	@Selector()
	static userInfo(userInfo: StoryStateModel) {
		return userInfo;
	}

	constructor(private storyService: StoryService) {
		super();
	}

	@Action(GetStory)
	getUserInfo(ctx: StateContext<StoryStateModel>, action: GetStory) {
		this.subs.sink = this.storyService
			.getStory(action.payload)
			.pipe(
				tap((res) => {
					ctx.patchState(res);
				})
			)
			.subscribe();
	}

	@Action(CreateStory)
	createStoryDto(ctx: StateContext<StoryStateModel>, action: CreateStory) {
		this.subs.sink = this.storyService
			.createStory(action.payload)
			.pipe(
				tap((res) => {
					ctx.patchState(res);
				})
			)
			.subscribe();
	}
}
