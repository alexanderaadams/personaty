import { IStoryStateModel } from '../../../story/data-access/store/story.model';

export interface tag {
	text: string;

	color: string;
}

export interface IProfileStateModel {
	fullName: string | null;

	username: string | null;

	profilePicture: string | null;

	created_at: Date | null;

	stories: IStoryStateModel[] | null;

	bio: tag | null;

	interests: tag[] | null;
}
