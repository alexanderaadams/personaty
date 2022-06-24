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
import { UserDocument } from '@features/user/models/user/user.schema';

import { StoryModel } from './models/story/story-model';
import { StoryDocument } from './models/story/story.schema';
import { ICreateStory } from './interfaces/create-story';
import { IUpdateStory } from './interfaces/update-story';
import { UserModel } from '../user/models/user/user.model';

@Injectable()
export class StoryService {
	storyModel: Model<StoryDocument>;
	userModel: Model<UserDocument>;

	constructor(
		private readonly myJWTService: MyJWTService,
		private readonly imageService: ImageService,
		private readonly fileStorageService: FileStorageService,
		private readonly injectedMongooseModelsService: InjectedMongooseModelsService
	) {
		this.storyModel = this.injectedMongooseModelsService.storyModel;
		this.userModel = this.injectedMongooseModelsService.userModel;
	}

	@TryCatchWrapper()
	async checkUserHasStory(authToken: string, id: string) {
		const authUser = await this.myJWTService.verifyToken(authToken);

		const [story, user] = await Promise.all([
			this.storyModel.findById(id).exec() as unknown as StoryModel,
			this.userModel.findById(authUser.id).exec() as unknown as UserModel,
		]);

		if (!user || !story)
			throw new HttpException('User Or Story Does not exist', 404);

		if (user.id !== story.userId)
			throw new UnauthorizedException(
				'You are not authorized to update this field'
			);
	}

	@TryCatchWrapper()
	async createStory(createStory: ICreateStory): Promise<StoryModel> {
		const { authToken, category, storyImage, requestHeadersHostUrl } =
			createStory;

		const { id } = await this.myJWTService.verifyToken(authToken);

		const user = (await this.userModel
			.findById(id)
			.exec()) as unknown as UserModel;

		if (!user) throw new HttpException('User does not exist', 404);

		const { fullImagePath, imageFileName, image } =
			await this.imageService.checkImageLegitimacy(storyImage, id, 'story');

		const [story] = await Promise.all([
			this.storyModel.create({
				category,
				story_image_url: `${requestHeadersHostUrl}/story/${imageFileName}`,
				userId: id,
			}),
			this.fileStorageService.graphqlSaveFileToStorage(image, fullImagePath),
		]);

		return story as unknown as Promise<StoryModel>;
	}

	async getStory(id: string): Promise<StoryModel> {
		return (await this.storyModel.findById(id)) as unknown as StoryModel;
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
