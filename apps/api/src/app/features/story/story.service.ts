import {
	HttpException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MyJWTService } from '@modules/jwt/jwt.service';
import { UserDocument } from '@features/user/models/user/user.schema';
import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';

import { StoryModel } from './models/story/story-model';
import { StoryDocument } from './models/story/story.schema';
import { ImageService } from '@modules/image/image.service';
import { ICreateStoryService } from './interfaces/create-story-service'
import { IUpdateStoryService } from './interfaces/update-story-service'

@Injectable()
export class StoryService {
	async checkUserHasStory(authToken: string, id: string) {
		const authUser = await this.myJWTService.verifyToken(authToken);

		const story = await this.storyModel.findById(id);

		const user = await this.userModel.findById(authUser.id);

		if (!user || !story)
			throw new HttpException('User Or Story Does not exist', 404);

		if (user._id.toString() !== story.user_id.toString())
			throw new UnauthorizedException(
				'You are not authorized to update this field'
			);
	}

	constructor(
		@InjectModel('Story') private readonly storyModel: Model<StoryDocument>,
		@InjectModel('User') private readonly userModel: Model<UserDocument>,
		private myJWTService: MyJWTService,
		private readonly imageService: ImageService
	) {}

	@TryCatchWrapper()
	async createStory(
		createStoryService: ICreateStoryService
	): Promise<StoryModel> {
		const { authToken, category, storyImage, requestHeadersHostUrl } =
			createStoryService;

		const { id } = await this.myJWTService.verifyToken(authToken);

		const user = await this.userModel.findById(id);

		if (!user) throw new HttpException('User does not exist', 404);

		const { fullImagePath, fileName, image } =
			await this.imageService.checkImageLegitimacy(storyImage, id);

		const [story] = await Promise.all([
			this.storyModel.create({
				category,
				story_image_url: `${requestHeadersHostUrl}/story/${fileName}`,
				user_id: id,
			}),
			// GqlSaveFileToStorage(image, fullImagePath),
		]);

		return story as unknown as Promise<StoryModel>;
	}

	async getStory(id: string): Promise<StoryModel> {
		return (await this.storyModel.findById(
			id
		)) as unknown as Promise<StoryModel>;
	}

	@TryCatchWrapper()
	async updateStory(
		updateStoryService: IUpdateStoryService
	): Promise<StoryModel> {
		const { authToken, id, updateStory } = updateStoryService;

		await this.checkUserHasStory(authToken, id);

		return (await this.storyModel.findByIdAndUpdate(id, updateStory, {
			new: true,
		})) as unknown as Promise<StoryModel>;
	}

	@TryCatchWrapper()
	async deleteStory(authToken: string, id: string): Promise<null> {
		await this.checkUserHasStory(authToken, id);

		return (await this.storyModel.findByIdAndRemove(
			id
		)) as unknown as Promise<null>;
	}
}
