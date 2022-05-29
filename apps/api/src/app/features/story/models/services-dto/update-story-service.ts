import { TImage } from '@core/utils/image/utils/types/image.type';
import { UpdateStoryDto } from '../dto/update-story';

export interface IUpdateStoryService {
	authToken: string;

	id: string;

	storyImage?: TImage;

	updateStory: UpdateStoryDto;
}
