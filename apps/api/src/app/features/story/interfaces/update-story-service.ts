import { TImage } from '@modules/image/utils/types/image.type';

import { Category } from '../models/category';
import { UpdateStoryDto } from '../models/dto/update-story';

export interface IUpdateStoryService {
	authToken: string;

	id: string;

	storyImage?: TImage;

	updateStory?: UpdateStoryDto;
}
