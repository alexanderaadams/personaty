/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { CreateStoryDto } from '../model/create-story.dto';
import {
	CREATE_STORY,
	GET_STORY,
	UPLOAD_STORY,
} from '../graphql/story.gql.schema';
import { StoryStateModel } from '../store/story.model';
import { environment} from '@persona/shared';


@Injectable({
	providedIn: 'root',
})
export class StoryService {
	constructor(private http: HttpClient, private apollo: Apollo) {}

	uploadStoryPhoto(formData: any, id: string) {
		return this.http.post(
			`${environment.BACKEND_URL}/api/v1/picture/upload/${id}`,
			formData,
			{
				reportProgress: true,
				observe: 'events',
			}
		);
	}

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

					return data.createStory as StoryStateModel;
				})
			);
	}

	createStory(story: CreateStoryDto) {
		return this.apollo
			.mutate({
				mutation: CREATE_STORY,
				variables: {
					story,
				},
				// errorPolicy: 'all',
			})
			.pipe(
				map(({ data }: any) => {
					// console.log(data);
					return data.createStory as StoryStateModel;
				})
			);
	}

	public uploadImage(image: File) {
		console.log(image);
		return this.apollo
			.mutate({
				mutation: UPLOAD_STORY,
				variables: {
					picture: image,
				},
				context: {
					useMultipart: true,
				},
				// errorPolicy: 'all',
			})
			.pipe(
				map((data: any) => {
					console.log(data);
					// return data.createStory as StoryStateModel;
				})
			)
			.subscribe();
		// const formData = new FormData();

		// formData.append('image', image);

		// return this.http.post('/api/v1/image-upload', formData);
	}
}
