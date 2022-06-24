import { IStoryStateModel } from '../../../story/data-access/state/story.model';

export interface HomeStateModel {
	fullName: string | null;

	username: string | null;

	profilePicture: string | null;

	createdAt: Date | null;

	stories: IStoryStateModel[] | null;

	bio: string | null;

	tags: string[] | null;
}
