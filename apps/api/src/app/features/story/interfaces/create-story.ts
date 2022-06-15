import { InterestAndBioAndCategory } from '@core/models/interest-and-bio-and-category';
import { TImage } from '@modules/image/utils/types/image.type';

export interface ICreateStory {
	authToken: string;

	category: Array<InterestAndBioAndCategory>;

	storyImage: TImage;

	requestHeadersHostUrl: string;
}
