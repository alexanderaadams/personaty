import {
	HttpException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';

import { MyJWTService } from '@modules/my-jwt/my-jwt.service';
import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';
import { ImageService } from '@modules/image/image.service';
import { FileStorageService } from '@core/services/file-storage.service';
import { InjectedMongooseModelsService } from '@modules/injected-mongoose-models/injected-mongoose-models.service';
import { UserService } from '@features/user/user.service';

import { StoryModel } from './models/story/story-model';
import { StoryDocument } from './models/story/story.schema';
import { ICreateStory } from './interfaces/create-story';
import { IUpdateStory } from './interfaces/update-story';

@Injectable()
export class StoryService {
	storyModel: Model<StoryDocument>;

	constructor(
		private readonly userService: UserService,
		private readonly myJWTService: MyJWTService,
		private readonly imageService: ImageService,
		private readonly fileStorageService: FileStorageService,
		private readonly injectedMongooseModelsService: InjectedMongooseModelsService
	) {
		this.storyModel = this.injectedMongooseModelsService.storyModel;
	}

	@TryCatchWrapper()
	async checkUserHasStory(authToken: string, id: string) {
		const authUser = await this.myJWTService.verifyToken(authToken);

		const [story, user] = await Promise.all([
			this.storyModel.findById(id),
			this.userService.userModel.findById(authUser.id),
		]);

		if (!user || !story)
			throw new HttpException('User Or Story Does not exist', 404);

		if (user._id.toString() !== story.user_id.toString())
			throw new UnauthorizedException(
				'You are not authorized to update this field'
			);
	}

	@TryCatchWrapper()
	async createStory(createStory: ICreateStory): Promise<StoryModel> {
		const { authToken, category, storyImage, requestHeadersHostUrl } =
			createStory;

		const { id } = await this.myJWTService.verifyToken(authToken);

		const user = await this.userService.userModel.findById(id);

		if (!user) throw new HttpException('User does not exist', 404);

		const { fullImagePath, imageFileName, image } =
			await this.imageService.checkImageLegitimacy(storyImage, id, 'story');

		const [story] = await Promise.all([
			this.storyModel.create({
				category,
				story_image_url: `${requestHeadersHostUrl}/story/${imageFileName}`,
				user_id: id,
			}),
			this.fileStorageService.graphqlSaveFileToStorage(image, fullImagePath),
		]);

		return story as unknown as Promise<StoryModel>;
	}

	async getStory(id: string): Promise<StoryModel> {
		return (await this.storyModel.findById(
			id
		)) as unknown as Promise<StoryModel>;
	}

	@TryCatchWrapper()
	async updateStory(updateStory: IUpdateStory): Promise<StoryModel> {
		const { authToken, id } = updateStory;

		await this.checkUserHasStory(authToken, id);

		return (await this.storyModel.findByIdAndUpdate(
			id,
			updateStory.updateStory,
			{
				new: true,
			}
		)) as unknown as Promise<StoryModel>;
	}

	@TryCatchWrapper()
	async deleteStory(authToken: string, id: string): Promise<null> {
		await this.checkUserHasStory(authToken, id);

		return (await this.storyModel.findByIdAndRemove(
			id
		)) as unknown as Promise<null>;
	}
}
