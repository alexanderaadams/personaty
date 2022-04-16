import {
	BadGatewayException,
	HttpException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserDocument } from '../user/user.schema';
import { CreateStoryDto } from './dto/create-story.dto';
import { StoryModel } from './story.model';
import { UpdateStoryDto } from './dto/update-story';
import { StoryDocument } from './story.schema';
import { MyJWTService } from '../jwt/jwt.service';

@Injectable()
export class StoryService {
	async checkUserHasStory(token: string, id: string) {
		const authUser = await this.myJWTService.verifyToken(token);

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
		private myJWTService: MyJWTService
	) {}

	async createStory(token: string, story: CreateStoryDto): Promise<StoryModel> {
		try {
			// const authenticatedUser = await this.userService.isVerified(token);

			// const user = await this.userModel.findById(authenticatedUser.id);

			// if (!user) throw new HttpException('User Does not exist', 404);

			const newStory = (await this.storyModel.create({
				...story,
			})) as unknown as Promise<StoryModel>;

			// await this.userModel.updateOne(
			// 	{ _id: (await newStory).userId.toString() },
			// 	{ $push: { stories: (await newStory)._id.toString() } }
			// );

			return newStory;
		} catch (err) {
			throw new HttpException(
				err?.message || err?.response?.message || 'Something Went Wrong',
				err?.status || err?.response?.statusCode || 500
			);
		}
	}

	async getStory(id: string): Promise<StoryModel> {
		try {
			return (await this.storyModel.findById(
				id
			)) as unknown as Promise<StoryModel>;
		} catch (err) {
			throw new BadGatewayException(err);
		}
	}

	async updateStory(
		token: string,
		id: string,
		attrs: UpdateStoryDto
	): Promise<StoryModel> {
		try {
			await this.checkUserHasStory(token, id);

			return (await this.storyModel.findByIdAndUpdate(id, attrs, {
				new: true,
			})) as unknown as Promise<StoryModel>;
		} catch (err) {
			throw new HttpException(
				err?.message || err?.response?.message || 'Something Went Wrong',
				err?.status || err?.response?.statusCode || 500
			);
		}
	}

	async deleteStory(token: string, id: string): Promise<null> {
		try {
			await this.checkUserHasStory(token, id);

			return (await this.storyModel.findByIdAndRemove(
				id
			)) as unknown as Promise<null>;
		} catch (err) {
			throw new HttpException(
				err?.message || err?.response?.message || 'Something Went Wrong',
				err?.status || err?.response?.statusCode || 500
			);
		}
	}
}
