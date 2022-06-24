export interface IInterestAndBioAndCategory {
	text: string;
	color: string;
}

export interface IStoryStateModel {
	id: string | null;

	category: Array<IInterestAndBioAndCategory> | null;

	StoryImageUrl: string | null;

	createdAt: Date | null;

	userId: string | null;
}
