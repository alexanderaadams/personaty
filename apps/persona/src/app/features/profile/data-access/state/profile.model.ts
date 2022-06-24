import {
	IStoryStateModel,
	IInterestAndBioAndCategory,
} from '@features/story/data-access/state/story.model';

export interface IProfileStateModel {
	id: string | null;

	profilePicture: string | null;

	profileCover: string | null;

	bio: IInterestAndBioAndCategory | null;

	birthDate: string | null;

	interests: Array<IInterestAndBioAndCategory> | null;

	fullName: string | null;

	username: string | null;

	email: string | null;

	createdAt: Date | null;

	stories: IStoryStateModel[] | null;
}
