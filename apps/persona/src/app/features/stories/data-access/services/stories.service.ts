/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { ICreateStories } from '../../interfaces/create-stories.interface';
import { CREATE_STORIES, GET_STORIES } from '../graphql/stories.gql.schema';
import { IStoriesStateModel } from '../state/stories.model';
import { SharedService } from '@persona/shared';
import { EMPTY } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class StoriesService {
	constructor(
		private http: HttpClient,
		private apollo: Apollo,
		private readonly sharedService: SharedService
	) {}

	// uploadStoriesPhoto(formData: any, id: string) {
	// 	return this.http.post(
	// 		`${environment.BACKEND_URL}/api/v1/picture/upload/${id}`,
	// 		formData,
	// 		{
	// 			reportProgress: true,
	// 			observe: 'events',
	// 		}
	// 	);
	// }

	getStories(id: string) {
		return this.apollo
			.watchQuery({
				query: GET_STORIES,
				variables: {
					id,
				},
				// errorPolicy: 'all',
			})
			.valueChanges.pipe(
				map(({ data }: any) => {
					// console.log(data);

					return data.createStories as IStoriesStateModel;
				})
			);
	}

	createStories(stories: ICreateStories) {
		const { category, storyImage } = stories;
		return this.apollo
			.mutate({
				mutation: CREATE_STORIES,
				variables: {
					story: { category },
					storyImage,
				},
				context: {
					useMultipart: true,
				},
			})
			.pipe(
				catchError(() => {
					this.sharedService.executingLoader$.next(false);
					return EMPTY;
				}),
				map(({ data }: any) => {
					this.sharedService.executingLoader$.next(false);

					// return data.createStories as IStoriesStateModel;
				})
			);
	}

	// public uploadImage(image: File) {
	// 	console.log(image);
	// 	return this.apollo
	// 		.mutate({
	// 			mutation: UPLOAD_STORIES,
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
	// 				// return data.createStories as IStoriesStateModel;
	// 			})
	// 		)
	// 		.subscribe();
	// const formData = new FormData();

	// formData.append('image', image);

	// return this.http.post('/api/v1/image-upload', formData);
}
// }
