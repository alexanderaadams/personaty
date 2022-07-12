import { ICreateStories } from '../../interfaces/create-stories.interface';

export class GetStories {
	static readonly type = '[Stories] Get Stories';
	constructor(public payload: string) {}
}

export class CreateStory {
	static readonly type = '[Stories] Create Stories';
	constructor(public payload: ICreateStories) {}
}
