import { TImage } from '@modules/image/utils/types/image.type';

import { Category } from '../models/category';

export interface ICreateStoryService {
	authToken: string;

	category: Array<Category>;

	storyImage: TImage;

	requestHeadersHostUrl: string;
}
