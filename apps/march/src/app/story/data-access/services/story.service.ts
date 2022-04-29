/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

import { CreateStoryDto } from '../model/create-story.dto';
import { CREATE_STORY, GET_STORY } from '../graphql/story.gql.schema';
import { StoryStateModel } from '../store/story.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
// import { environment } from '';

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
				context: {
					withCredentials: true,
				},
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
				context: {
					withCredentials: true,
				},
			})
			.pipe(
				map(({ data }: any) => {
					// console.log(data);
					return data.createStory as StoryStateModel;
				})
			);
	}
}
