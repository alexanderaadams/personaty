import { TImage } from '@core/utils/image/utils/types/image.type';
import { Category } from '../category';

export interface ICreateStoryService {
	authToken: string;

	category: Array<Category>;

	storyImage: TImage;

	requestHeadersHostUrl: string;
}
