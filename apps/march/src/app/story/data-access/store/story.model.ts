export interface Category {
	text: string;

	color: string;
}

export interface StoryStateModel {
	_id: string | null;

	category: Category[] | null;

	// cover_image: string | null;

	created_at: Date | null;

	user_id: string | null;
}
