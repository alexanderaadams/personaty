import { IInterestAndBioAndCategory, IStoryStateModel } from "@features/story/data-access/state/story.model";

export interface IUser {
	id: string;

	profilePicture?: string;

	profileCover?: string;

	bio?: IInterestAndBioAndCategory;

	birthDate: string;

	interests?: Array<IInterestAndBioAndCategory>;

	fullName?: string;

	username?: string;

	email?: string;

	locale?:string;

	createdAt?: Date;

	stories?: IStoryStateModel[];
}
