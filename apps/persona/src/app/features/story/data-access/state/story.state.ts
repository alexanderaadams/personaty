import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Action, State, StateContext, Selector } from '@ngxs/store';

import { IStoryStateModel } from './story.model';
import { CreateStory, GetStory } from './story.action';
import { StoryService } from '../services/story.service';
import { UnsubscribeOnDestroyAdapter } from '@persona/shared';

@State<IStoryStateModel>({
	name: 'story',
	defaults: {
		id: null,

		category: null,

		StoryImageUrl: null,

		createdAt: null,

		userId: null,
	},
})
@Injectable()
export class StoryState extends UnsubscribeOnDestroyAdapter {
	// private querySubscription!: Subscription;

	@Selector()
	static userInfo(userInfo: IStoryStateModel) {
		return userInfo;
	}

	constructor(private storyService: StoryService) {
		super();
	}

	@Action(GetStory)
	getUserInfo(ctx: StateContext<IStoryStateModel>, action: GetStory) {
		this.subs.sink = this.storyService
			.getStory(action.payload)
			.pipe(
				tap((res: IStoryStateModel) => {
					ctx.patchState(res);
				})
			)
			.subscribe();
	}

	@Action(CreateStory)
	createStoryDto(ctx: StateContext<IStoryStateModel>, action: CreateStory) {
		this.subs.sink = this.storyService
			.createStory(action.payload)
			// .pipe(
			// 	tap((res: IStoryStateModel) => {
			// 		ctx.patchState(res);
			// 	})
			// )
			.subscribe();
	}
}
