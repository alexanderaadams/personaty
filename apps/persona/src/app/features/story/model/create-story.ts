import { ICategory } from '../data-access/store/story.model';

export interface ICreateStory {
	category: Array<ICategory>;

	storyImage: File;
}
