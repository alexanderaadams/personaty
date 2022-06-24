import { IInterestAndBioAndCategory } from '../data-access/state/story.model';

export interface ICreateStory {
	category: Array<IInterestAndBioAndCategory>;

	storyImage: File;
}
