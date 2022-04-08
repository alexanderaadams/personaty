import { UseGuards } from '@nestjs/common';
import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TokenAuthGuard } from '../utils/guards/is-auth.guard';
import { StoryService } from './story.service';
import { Request } from 'express';
import {
	CreateStory,
	DeleteStory,
	GetStory,
	StoryModel,
	UpdateStory,
	Delete,
} from './story.model';
import { StoryReturn } from '../core/graphql.schema';

@Resolver('Story')
// @UseGuards(TokenAuthGuard)
export class StoryResolver {
	constructor(private readonly storyService: StoryService) {}

	@Mutation(() => StoryModel, {
		name: 'createStory',
		description: 'Create Story',
	})
	async create(
		@Args('story', { type: () => CreateStory }) create: CreateStory,
		@Context('req') req: Request
	): Promise<StoryModel> {
		return await this.storyService.createStory(req.cookies.token, create);
	}

	@Query(() => StoryModel, {
		name: 'getStory',
		description: 'Get Story',
	})
	async getStory(
		@Args('story', { type: () => GetStory }) getStory: GetStory
	): Promise<StoryModel> {
		return await this.storyService.getStory(getStory.id);
	}

	@Mutation(() => StoryModel, {
		name: 'updateStory',
		description: 'Update Story',
	})
	async updateStory(
		@Args('id', { type: () => ID }) id: string,
		@Args('story', { type: () => UpdateStory }) updateStory: UpdateStory,
		@Context('req') req: Request
	): Promise<StoryModel> {
		return await this.storyService.updateStory(
			req.cookies.token,
			id,
			updateStory
		);
	}

	@Mutation(() => Delete, {
		name: 'deleteStory',
		description: 'Delete Story',
	})
	async deleteStory(
		@Args('story', { type: () => DeleteStory }) deleteStory: DeleteStory,
		@Context('req') req: Request
	): Promise<Delete> {
		await await this.storyService.deleteStory(
			req.cookies.token,
			deleteStory.id
		);

		return { status: 'Story has been deleted successfully' };
	}
}
