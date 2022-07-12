import { IInterestAndBioAndCategory } from '../../stories/data-access/state/stories.model';

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
