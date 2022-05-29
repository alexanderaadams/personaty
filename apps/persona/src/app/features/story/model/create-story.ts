import { ICategory } from '../data-access/store/story.model';

export interface ICreateStory {
	category: ICategory[];

	storyImage: File;
}
