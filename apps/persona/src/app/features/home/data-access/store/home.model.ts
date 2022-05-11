import { StoryStateModel } from '../../../story/data-access/store/story.model';

export interface HomeStateModel {
	fullName: string | null;

	username: string | null;

	profilePicture: string | null;

	created_at: Date | null;

	stories: StoryStateModel[] | null;

	bio: string | null;

	tags: string[] | null;
}
