import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';

import { environment } from '@environment';
import { GqlThrottlerBehindProxyGuard } from '@core/guards/throttler/gql-throttler-behind-proxy.guard';
import { GqlThrottlerGuard } from '@core/guards/throttler/gql-throttler.guard';
import { TokenAuthGuard } from '@core/guards/is-auth.guard';

import { UpdateUserDto } from './models/dto/update-user.dto';
import { UserModel } from './models/user-db/user-db.model';
import { UserService } from './user.service';

@UseGuards(
	environment.production ? GqlThrottlerBehindProxyGuard : GqlThrottlerGuard,
	TokenAuthGuard
)
@Throttle(50, 60)
// @UseFilters(GqlAllHttpExceptionFilter)
@Resolver('User')
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => UserModel, {
		name: 'getUser',
		description: 'Get Story',
	})
	async getStory(
		@Args('id', { type: () => ID }) id: string
	): Promise<UserModel | null> {
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
