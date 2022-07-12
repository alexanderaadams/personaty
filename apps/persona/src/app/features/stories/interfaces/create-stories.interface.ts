import { IInterestAndBioAndCategory } from '../data-access/state/stories.model';

export interface ICreateStories {
	category: Array<IInterestAndBioAndCategory>;

	storyImage: File;
}
