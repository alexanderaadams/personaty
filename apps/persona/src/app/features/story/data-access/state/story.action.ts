import { ICreateStory } from '../../interfaces/create-story.interface';

export class GetStory {
	static readonly type = '[Story] Get Story';
	constructor(public payload: string) {}
}

export class CreateStory {
	static readonly type = '[Story] Create Story';
	constructor(public payload: ICreateStory) {}
}
