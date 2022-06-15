import { TImage } from '@modules/image/utils/types/image.type';

import { UpdateStoryDto } from '../models/dto/update-story';

export interface IUpdateStory {
	authToken: string;

	id: string;

	storyImage?: TImage;

	updateStory?: UpdateStoryDto;
}
