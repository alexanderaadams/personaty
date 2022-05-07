import { MyJWTService } from './../jwt/jwt.service';
import { UseGuards } from '@nestjs/common';
import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';

import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { StoryModel } from './story.model';
import { GetStoryDto } from './dto/get-story.dto';
import { UpdateStoryDto } from './dto/update-story';
import { DeleteStoryDto } from './dto/delete-story.dto';
import { StoryStatus } from './entities/story-status.entity';
import { TokenAuthGuard } from '../core/guards/is-auth.guard';
import { GraphQLUpload, Upload, FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { ImageService } from '../core/utilities/image/image.service';
import { Throttle } from '@nestjs/throttler';
import { environment } from '../../environments/environment';
import { GqlThrottlerBehindProxyGuard } from '../core/guards/throttler/gql-throttler-behind-proxy.guard';
import { GqlThrottlerGuard } from '../core/guards/throttler/gql-throttler.guard';

@UseGuards(
	environment.production ? GqlThrottlerBehindProxyGuard : GqlThrottlerGuard,
	TokenAuthGuard
)
@Throttle(50, 60)
@Resolver('Story')
export class StoryResolver {
	constructor(
		private readonly storyService: StoryService,

		private readonly myJWTService: MyJWTService
	) {}

	@Mutation(() => StoryModel, {
		name: 'createStory',
		description: 'Create Story',
	})
	async createStory(
		@Args('story', { type: () => CreateStoryDto }) story: CreateStoryDto,
		@Args('storyImage', { type: () => GraphQLUpload })
		storyImage: FileUpload,
		@Context('req') req: Request
	): Promise<StoryModel> {
		console.log(story, storyImage);

		return this.storyService.createStory(
			req.cookies.token,
			story,
			storyImage,
			`${req.protocol}://${req.headers.host}`
		);
	}

	@Query(() => StoryModel, {
		name: 'getStory',
		description: 'Get Story',
	})
	async getStory(
		@Args('story', { type: () => GetStoryDto }) getStory: GetStoryDto
	): Promise<StoryModel> {
		return await this.storyService.getStory(getStory.id);
	}

	@Mutation(() => StoryModel, {
		name: 'updateStory',
		description: 'Update Story',
	})
	async updateStory(
		@Args('id', { type: () => ID }) id: string,
		@Args('story', { type: () => UpdateStoryDto }) updateStory: UpdateStoryDto,
		@Context('req') req: Request
	): Promise<StoryModel> {
		return await this.storyService.updateStory(
			req.cookies.token,
			id,
			updateStory
		);
	}

	@Mutation(() => StoryStatus, {
		name: 'deleteStory',
		description: 'Delete Story',
	})
	async deleteStory(
		@Args('story', { type: () => DeleteStoryDto }) deleteStory: DeleteStoryDto,
		@Context('req') req: Request
	): Promise<StoryStatus> {
		await await this.storyService.deleteStory(
			req.cookies.token,
			deleteStory.id
		);

		return { status: 'Story has been deleted successfully' };
	}
}
