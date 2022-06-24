import { IInterestAndBioAndCategory } from '../../story/data-access/state/story.model';

export interface IUpdateProfile {
	profilePicture?: string;

	profileCover?: string;

	bio?: IInterestAndBioAndCategory;

	birthDate?: string;

	interests?: Array<IInterestAndBioAndCategory>;

	fullName?: string;

	username?: string;

	email?: string;

	locale?: string;
}
