export interface ICategory {
	text: string;
	color: string;
}

export interface IStoryStateModel {
	_id: string | null;

	category: ICategory[] | null;

 StoryImageUrl: string | null;

	created_at: Date | null;

	user_id: string | null;
}
