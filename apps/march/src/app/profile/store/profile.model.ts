import { StoryModel } from '../../core/story.model';

export interface ProfileStateModel {
	fullName: string | null;

	username: string | null;

	profilePicture: string | null;

	created_at: Date | null;

	stories: StoryModel[] | null;

	bio: string | null;
	tags: string[] | null;
}
