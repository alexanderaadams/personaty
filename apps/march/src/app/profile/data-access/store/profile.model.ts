import { StoryStateModel } from "../../../story/data-access/store/story.model";



export interface tag {text:string,color:string}

export interface ProfileStateModel {
	fullName: string | null;

	username: string | null;

	profilePicture: string | null;

	created_at: Date | null;

	stories: StoryStateModel[] | null;

	bio: tag | null;

	tags: tag[] | null;
}
