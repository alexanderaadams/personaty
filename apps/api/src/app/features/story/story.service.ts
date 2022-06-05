import {
	HttpException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MyJWTService } from '@modules/jwt/jwt.service';
import { UserDocument, User } from '@features/user/models/user/user.schema';
import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';
import { ImageService } from '@modules/image/image.service';
import { FileStorageService } from '@core/utils/file-storage.service';

import { Story_Model } from './models/story/story-model';
import { StoryDocument, Story } from './models/story/story.schema';
import { ICreateStoryService } from './interfaces/create-story-service';
import { IUpdateStoryService } from './interfaces/update-story-service';

@Injectable()
export class StoryService {
	constructor(
		@InjectModel(Story.name) private storyModel: Model<StoryDocument>,
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private myJWTService: MyJWTService,
		private imageService: ImageService,
		private fileStorageService: FileStorageService
	) {}

	async checkUserHasStory(authToken: string, id: string) {
		const authUser = await this.myJWTService.verifyToken(authToken);

		const [story, user] = await Promise.all([
			this.storyModel.findById(id),
			this.userModel.findById(authUser.id),
		]);

		if (!user || !story)
			throw new HttpException('User Or Story Does not exist', 404);

		if (user._id.toString() !== story.user_id.toString())
			throw new UnauthorizedException(
				'You are not authorized to update this field'
			);
	}

	@TryCatchWrapper()
	async createStory(
		createStoryService: ICreateStoryService
	): Promise<Story_Model> {
		const { authToken, category, storyImage, requestHeadersHostUrl } =
			createStoryService;

		const { id } = await this.myJWTService.verifyToken(authToken);

		const user = await this.userModel.findById(id);

		if (!user) throw new HttpException('User does not exist', 404);

		const { fullImagePath, imageFileName, image } =
			await this.imageService.checkImageLegitimacy(storyImage, id);

		const [story] = await Promise.all([
			this.storyModel.create({
				category,
				story_image_url: `${requestHeadersHostUrl}/story/${imageFileName}`,
				user_id: id,
			}),
			this.fileStorageService.graphqlSaveFileToStorage(image, fullImagePath),
		]);

		return story as unknown as Promise<Story_Model>;
	}

	async getStory(id: string): Promise<Story_Model> {
		return (await this.storyModel.findById(
			id
		)) as unknown as Promise<Story_Model>;
	}

	@TryCatchWrapper()
	async updateStory(
		updateStoryService: IUpdateStoryService
	): Promise<Story_Model> {
		const { authToken, id, updateStory } = updateStoryService;

		await this.checkUserHasStory(authToken, id);

		return (await this.storyModel.findByIdAndUpdate(id, updateStory, {
			new: true,
		})) as unknown as Promise<Story_Model>;
	}

	@TryCatchWrapper()
	async deleteStory(authToken: string, id: string): Promise<null> {
		await this.checkUserHasStory(authToken, id);

		return (await this.storyModel.findByIdAndRemove(
			id
		)) as unknown as Promise<null>;
	}
}
