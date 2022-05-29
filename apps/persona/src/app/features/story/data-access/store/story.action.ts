import { ICreateStory } from '../../model/create-story';

export class GetStory {
	static readonly type = '[Story] Get Story';
	constructor(public payload: string) {}
}

export class CreateStory {
	static readonly type = '[Story] Create Story';
	constructor(public payload: ICreateStory) {}
}
