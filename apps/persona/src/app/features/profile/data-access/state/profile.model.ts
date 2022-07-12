import { IInterestAndBioAndCategory } from '@features/stories/data-access/state/stories.model';

export interface IProfileStateModel {
	id: string | null;

	profilePicture: string | null;

	profileCover: string | null;

	bio: IInterestAndBioAndCategory | null;

	locale: string | null;

	birthDate: string | null;

	interests: Array<IInterestAndBioAndCategory> | null;

	fullName: string | null;

	username: string | null;

	email: string | null;

	createdAt: Date | null;

	sex: 'female' | 'male' | 'other' | null;
}
