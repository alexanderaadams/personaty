import { StoryStateModel } from '../../story/store/story.model';
export interface ProfileStateModel {
	fullName: string | null;

	username: string | null;

	profilePicture: string | null;

	created_at: Date | null;

	stories: StoryStateModel[] | null;

	bio: string | null;

	tags: string[] | null;
}