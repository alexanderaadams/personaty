import { UseGuards } from '@nestjs/common';
import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TokenAuthGuard } from '../utils/guards/is-auth.guard';
import { Request } from 'express';

import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { StoryModel } from './story.model';
import { GetStoryDto } from './dto/get-story.dto';
import { UpdateStoryDto } from './dto/update-story';
import { DeleteStoryDto } from './dto/delete-story.dto';
import { StoryStatus } from './entities/story-status.entity';

@Resolver('Story')
@UseGuards(TokenAuthGuard)
export class StoryResolver {
	constructor(private readonly storyService: StoryService) {}

	@Mutation(() => StoryModel, {
		name: 'createStory',
		description: 'Create Story',
	})
	async create(
		@Args('story', { type: () => CreateStoryDto }) create: CreateStoryDto,
		@Context('req') req: Request
	): Promise<StoryModel> {
		return await this.storyService.createStory(req.cookies.token, create);
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
