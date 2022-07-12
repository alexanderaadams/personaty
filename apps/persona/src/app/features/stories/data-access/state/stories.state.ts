import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Action, State, StateContext, Selector } from '@ngxs/store';

import { IStoriesStateModel } from './stories.model';
import { CreateStory, GetStories } from './stories.action';
import { StoriesService } from '../services/stories.service';

@State<Array<IStoriesStateModel>>({
	name: 'stories',
	defaults: [
		{
			id: null,

			category: null,

			StoriesImageUrl: null,

			createdAt: null,

			userId: null,
		},
	],
})
@Injectable()
export class StoriesState {
	@Selector()
	static value(stories: Array<IStoriesStateModel>) {
		return stories;
	}

	constructor(private storiesService: StoriesService) {}

	@Action(GetStories)
	getUserInfo(ctx: StateContext<IStoriesStateModel>, action: GetStories) {
		this.storiesService
			.getStories(action.payload)
			.pipe(
				tap((res: IStoriesStateModel) => {
					ctx.patchState(res);
				})
			)
			.subscribe();
	}

	@Action(CreateStory)
	createStoriesDto(ctx: StateContext<IStoriesStateModel>, action: CreateStory) {
		this.storiesService
			.createStories(action.payload)
			// .pipe(
			// 	tap((res: IStoriesStateModel) => {
			// 		ctx.patchState(res);
			// 	})
			// )
			.subscribe();
	}
}
