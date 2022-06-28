import { UseGuards } from '@nestjs/common';
import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';

import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

import { environment } from '@environment';
import { GqlThrottlerBehindProxyGuard } from '@core/guards/throttler/gql-throttler-behind-proxy.guard';
import { GqlThrottlerGuard } from '@core/guards/throttler/gql-throttler.guard';
import { TokenAuthGuard } from '@core/guards/is-auth.guard';

import { UpdateUserDto } from './models/dto/update-user.dto';
import { UserModel } from './models/user/user.model';
import { UserService } from './user.service';
import { TImage } from '@modules/image/utils/types/image.type';
import { ConfirmDeleteUser } from './models/dto/confirm-delete-user.dto';
import { AuthenticationStatus } from '../auth/models/authentication-status';

@UseGuards(
	environment.production ? GqlThrottlerBehindProxyGuard : GqlThrottlerGuard,
	TokenAuthGuard
)
@Throttle(120, environment.THROTTLER_DEFAULT_TIME_TO_LIVE_LIMIT)
@Resolver('User')
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => UserModel, {
		name: 'getUser',
		description: 'Get User if exists',
	})
	async getUser(
		@Args('id', { type: () => ID }) id: string
	): Promise<UserModel | null> {
		return await this.userService.findUserById(id);
	}

	@Mutation(() => UserModel, {
		name: 'updateUser',
		description: 'Update User profile ',
	})
	async updateUser(
		@Context('req') req: Request,
		@Args('profilePicture', { type: () => GraphQLUpload })
		profilePicture: TImage,
		@Args('profileCover', { type: () => GraphQLUpload })
		profileCover: TImage,
		@Args('user', {
			type: () => UpdateUserDto,
		})
		attrs: UpdateUserDto
	) {
		return await this.userService.updateUser({
			authToken: req.cookies.auth,
			profilePicture,
			profileCover,
			attrs,
		});
	}

	@Mutation(() => AuthenticationStatus, {
		name: 'deleteUser',
		description: 'Create Story',
	})
	async deleteUser(
		@Args('confirmDeleteUser', { type: () => ConfirmDeleteUser })
		confirmDeleteUser: boolean,
		@Context('req') req: Request
	) {
		const hasUserBeenDeleted = await this.userService.deleteUser(
			confirmDeleteUser,
			req.cookies.auth
		);

		if (hasUserBeenDeleted)
			return { status: 'User has been deleted successfully' };

		return { status: 'Failed to delete User' };
	}
}
