import { CreateStoryDto } from "../model/create-story.dto";


export class GetStory {
	static readonly type = '[Profile] Get Story';
	constructor(public payload: string) {}
}

export class CreateStory {
	static readonly type = '[Profile] Create Story';
	constructor(public payload: CreateStoryDto) {}
}
