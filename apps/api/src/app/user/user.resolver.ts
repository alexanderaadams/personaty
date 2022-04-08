import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Multer } from 'multer';

import { Status, UpdateUser, UserModel } from './user.model';
import { UserService } from './user.service';
import { TokenAuthGuard } from '../utils/guards/is-auth.guard';
import { saveImageToStorage } from './image-storage';

@Resolver('User')
// @UseGuards(TokenAuthGuard)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => UserModel, {
		name: 'getUser',
		description: 'Get Story',
	})
	async getStory(
		@Args('id', { type: () => ID }) id: string
	): Promise<UserModel> {
		return await this.userService.findUserById(id);
	}

	// @Query(() => Status, {
	// 	name: 'getImage',
	// 	description: 'Get Story',
	// })
	// async getImage(
	// 	@Args('id', { type: () => ID }) id: string,
	// 	@Context('res') res: Response
	// ) {
	// 	const { profilePicture } = await this.userService.findUserById(id);
	// 	res.sendFile(profilePicture, { root: 'upload' });
	// 	return { status: "User's profile picture has been sent successfully" };
	// }

	@Mutation(() => UserModel, {
		name: 'updateUser',
		description: 'Create Story',
	})
	async updateUser(
		@Args('id', { type: () => ID }) id: string,
		@Args('user', {
			type: () => UpdateUser,
		})
		updateUser: UpdateUser
	) {
		return await this.userService.updateUser(id, updateUser);
	}

	@Mutation(() => Status, {
		name: 'deleteUser',
		description: 'Create Story',
	})
	async deleteUser(@Args('id', { type: () => ID }) id: string) {
		await this.userService.deleteUser(id);
		return { status: 'User has been deleted successfully' };
	}

	// @Mutation(() => Status, {
	// 	name: 'uploadProfilePicture',
	// 	description: 'Create Story',
	// })
	// @UseInterceptors(FileInterceptor('profilePicture', saveImageToStorage))
	// async uploadImage(
	// 	@UploadedFile() file: Express.Multer.File,
	// 	@Args('id', { type: () => ID }) id: string
	// ) {
	// 	await this.userService.uploadImage(file, id);

	// 	return { status: "User's profile picture has been uploaded successfully" };
	// }
}
