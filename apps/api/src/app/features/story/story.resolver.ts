import { UseGuards } from '@nestjs/common';
import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
// import { GraphQLUpload } from 'graphql-upload';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { Throttle } from '@nestjs/throttler';

import { TokenAuthGuard } from '@core/guards/is-auth.guard';
import { environment } from '@environment';
import { GqlThrottlerBehindProxyGuard } from '@core/guards/throttler/gql-throttler-behind-proxy.guard';
import { GqlThrottlerGuard } from '@core/guards/throttler/gql-throttler.guard';

import { StoryService } from './story.service';
import { CreateStoryDto } from './models/dto/create-story.dto';
import { GetStoryDto } from './models/dto/get-story.dto';
import { UpdateStoryDto } from './models/dto/update-story';
import { DeleteStoryDto } from './models/dto/delete-story.dto';
import { StoryStatus } from './models/story-status';
import { StoryModel } from './models/story/story-model';
import { TImage } from '@modules/image/utils/types/image.type';

@UseGuards(
	environment.production ? GqlThrottlerBehindProxyGuard : GqlThrottlerGuard,
	TokenAuthGuard
)
@Throttle(50, 60)
// @UseFilters(GqlAllHttpExceptionFilter)
@Resolver('Story')
export class StoryResolver {
	constructor(private readonly storyService: StoryService) {}

	@Mutation(() => StoryModel, {
		name: 'createStory',
		description: 'Create Story',
	})
	async createStory(
		@Args('story', { type: () => CreateStoryDto }) createStory: CreateStoryDto,
		@Args('storyImage', { type: () => GraphQLUpload })
		storyImage: TImage,
		@Context('req') req: Request
	): Promise<StoryModel> {
		return this.storyService.createStory({
			authToken: req.cookies.auth,
			category: createStory.category,
			storyImage,
			requestHeadersHostUrl: `${req.protocol}://${req.headers.host}`,
		});
	}

	// @Get('stream-file')
	// getFile(): StreamableFile {
	// 	const file = createReadStream(join(process.cwd(), 'package.json'));
	// 	return new StreamableFile(file);
	// }

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
		return await this.storyService.updateStory({
			authToken: req.cookies.auth,
			id,
			updateStory,
		});
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
