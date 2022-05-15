import {  UseGuards } from '@nestjs/common';
import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Throttle } from '@nestjs/throttler';

import { TokenAuthGuard } from '@core/guards/is-auth.guard';
import { environment } from '@environment';
import { MyJWTService } from '@modules/jwt/jwt.service';
import { GqlThrottlerBehindProxyGuard } from '@core/guards/throttler/gql-throttler-behind-proxy.guard';
import { GqlThrottlerGuard } from '@core/guards/throttler/gql-throttler.guard';

import { StoryService } from './story.service';
import { CreateStoryDto } from './models/dto/create-story.dto';
import { GetStoryDto } from './models/dto/get-story.dto';
import { UpdateStoryDto } from './models/dto/update-story';
import { DeleteStoryDto } from './models/dto/delete-story.dto';
import { StoryStatus } from './models/story-status';
import { StoryDbModel } from './models/story-db/story-db.model';

@UseGuards(
	environment.production ? GqlThrottlerBehindProxyGuard : GqlThrottlerGuard,
	TokenAuthGuard
)
@Throttle(50, 60)
// @UseFilters(GqlAllHttpExceptionFilter)
@Resolver('Story')
export class StoryResolver {
	constructor(
		private readonly storyService: StoryService,

		private readonly myJWTService: MyJWTService
	) {}

	@Mutation(() => StoryDbModel, {
		name: 'createStory',
		description: 'Create Story',
	})
	async createStory(
		@Args('story', { type: () => CreateStoryDto }) story: CreateStoryDto,
		@Args('storyImage', { type: () => GraphQLUpload })
		storyImage: FileUpload,
		@Context('req') req: Request
	): Promise<StoryDbModel> {

		return this.storyService.createStory(
			req.cookies.auth,
			story,
			storyImage,
			`${req.protocol}://${req.headers.host}`
		);
	}

	@Query(() => StoryDbModel, {
		name: 'getStory',
		description: 'Get Story',
	})
	async getStory(
		@Args('story', { type: () => GetStoryDto }) getStory: GetStoryDto
	): Promise<StoryDbModel> {
		return await this.storyService.getStory(getStory.id);
	}

	@Mutation(() => StoryDbModel, {
		name: 'updateStory',
		description: 'Update Story',
	})
	async updateStory(
		@Args('id', { type: () => ID }) id: string,
		@Args('story', { type: () => UpdateStoryDto }) updateStory: UpdateStoryDto,
		@Context('req') req: Request
	): Promise<StoryDbModel> {
		return await this.storyService.updateStory(
			req.cookies.auth,
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
		await await this.storyService.deleteStory(req.cookies.auth, deleteStory.id);

		return { status: 'Story has been deleted successfully' };
	}
}
