import {
	HttpException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

import { MyJWTService } from '@modules/jwt/jwt.service';
import { ImageService } from '@core/utils/image/image.service';
import { UserDocument } from '@features/user/models/user-db/user-db.schema';
import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';

import { StoryDbModel } from './models/story-db/story-db.model';
import { CreateStoryDto } from './models/dto/create-story.dto';
import { UpdateStoryDto } from './models/dto/update-story';
import { StoryDocument } from './models/story-db/story-db.schema';

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
		authToken: string,
		story: CreateStoryDto,
		storyImage: FileUpload,
		hostUrl: string
	): Promise<StoryDbModel> {
		const authenticatedUser = await this.myJWTService.verifyToken(authToken);

		const user = await this.userModel.findById(authenticatedUser.id);

		if (!user) throw new HttpException('User Does not exist', 404);

		const checkImageLegitimacy = await this.imageService.checkImageLegitimacy(
			storyImage
		);

		if (!checkImageLegitimacy.valid)
			throw new HttpException(checkImageLegitimacy.error ?? 'Error', 400);

		const fileExtension: string = path.extname(storyImage.filename);
		const fileName: string = uuidv4() + fileExtension;

		const storeImage = new Promise((resolve, reject) =>
			storyImage
				.createReadStream()
				.pipe(
					createWriteStream(`${checkImageLegitimacy.fullImagePath}/${fileName}`)
				)
				.on('finish', () => resolve(true))
				.on('error', () => reject(false))
		);

		if (!(await storeImage))
			throw new HttpException('Something went wrong', 500);

		return (await this.storyModel.create({
			...story,
			storyImageUrl: `${hostUrl}/story/${fileName}`,
			created_at: Date.now(),
		})) as unknown as Promise<StoryDbModel>;

		// await this.userModel.updateOne(
		// 	{ _id: (await newStory).userId.toString() },
		// 	{ $push: { stories: (await newStory)._id.toString() } }
		// );
	}

	async getStory(id: string): Promise<StoryDbModel> {
		return (await this.storyModel.findById(
			id
		)) as unknown as Promise<StoryDbModel>;
	}

	@TryCatchWrapper()
	async updateStory(
		authToken: string,
		id: string,
		attrs: UpdateStoryDto
	): Promise<StoryDbModel> {
		await this.checkUserHasStory(authToken, id);

		return (await this.storyModel.findByIdAndUpdate(id, attrs, {
			new: true,
		})) as unknown as Promise<StoryDbModel>;
	}

	@TryCatchWrapper()
	async deleteStory(authToken: string, id: string): Promise<null> {
		await this.checkUserHasStory(authToken, id);

		return (await this.storyModel.findByIdAndRemove(
			id
		)) as unknown as Promise<null>;
	}
}
