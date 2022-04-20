import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TokenAuthGuard } from '../utils/guards/is-auth.guard';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from './entities/user-status.entity';
import { UserModel } from './user.model';
import { UserService } from './user.service';

@Resolver('User')
@UseGuards(TokenAuthGuard)
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

	@Mutation(() => UserModel, {
		name: 'updateUser',
		description: 'Create Story',
	})
	async updateUser(
		@Args('id', { type: () => ID }) id: string,
		@Args('user', {
			type: () => UpdateUserDto,
		})
		updateUser: UpdateUserDto
	) {
		return await this.userService.updateUser(id, updateUser);
	}

	// @Mutation(() => UserStatus, {
	// 	name: 'deleteUser',
	// 	description: 'Create Story',
	// })
	// async deleteUser(@Args('id', { type: () => ID }) id: string) {
	// 	await this.userService.deleteUser(id);
	// 	return { status: 'User has been deleted successfully' };
	// }
}
