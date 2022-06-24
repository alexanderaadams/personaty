/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { ICreateStory } from '../../interfaces/create-story.interface';
import { CREATE_STORY, GET_STORY } from '../graphql/story.gql.schema';
import { IStoryStateModel } from '../state/story.model';
import { SharedService } from '@persona/shared';
import { EMPTY } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class StoryService {
	constructor(
		private http: HttpClient,
		private apollo: Apollo,
		private readonly sharedService: SharedService
	) {}

	// uploadStoryPhoto(formData: any, id: string) {
	// 	return this.http.post(
	// 		`${environment.BACKEND_URL}/api/v1/picture/upload/${id}`,
	// 		formData,
	// 		{
	// 			reportProgress: true,
	// 			observe: 'events',
	// 		}
	// 	);
	// }

	getStory(id: string) {
		return this.apollo
			.watchQuery({
				query: GET_STORY,
				variables: {
					id,
				},
				// errorPolicy: 'all',
			})
			.valueChanges.pipe(
				map(({ data }: any) => {
					// console.log(data);

					return data.createStory as IStoryStateModel;
				})
			);
	}

	createStory(story: ICreateStory) {
		const { category, storyImage } = story;
		return this.apollo
			.mutate({
				mutation: CREATE_STORY,
				variables: {
					story: { category },
					storyImage,
				},
				context: {
					useMultipart: true,
				},
				// errorPolicy: 'all',
			})
			.pipe(
				catchError(() => {
					this.sharedService.executingLoader$.next(false);
					return EMPTY;
				}),
				map(({ data }: any) => {
					this.sharedService.executingLoader$.next(false);

					// return data.createStory as IStoryStateModel;
				})
			);
	}

	// public uploadImage(image: File) {
	// 	console.log(image);
	// 	return this.apollo
	// 		.mutate({
	// 			mutation: UPLOAD_STORY,
	// 			variables: {
	// 				picture: image,
	// 			},
	// 			context: {
	// 				useMultipart: true,
	// 			},
	// 			// errorPolicy: 'all',
	// 		})
	// 		.pipe(
	// 			map((data: any) => {
	// 				console.log(data);
	// 				// return data.createStory as IStoryStateModel;
	// 			})
	// 		)
	// 		.subscribe();
	// const formData = new FormData();

	// formData.append('image', image);

	// return this.http.post('/api/v1/image-upload', formData);
}
// }
