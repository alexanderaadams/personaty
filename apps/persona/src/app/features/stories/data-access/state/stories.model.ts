export interface IInterestAndBioAndCategory {
	text: string;
	color: string;
}

export interface IStoriesStateModel {
	id: string | null;

	category: Array<IInterestAndBioAndCategory> | null;

	StoriesImageUrl: string | null;

	createdAt: Date | null;

	userId: string | null;
}
