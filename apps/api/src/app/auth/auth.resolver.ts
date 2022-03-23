import { Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';

import { FindUser } from '../core/shared.model';
import {
	Available,
	Signup,
	Login,
	Status,
	ForgotPassword,
	ResetPasswordToken,
	GoogleOauth2,
} from './auth.model';

import { AuthService } from './auth.service';
import { TokenAuthGuard } from '../utils/guards/is-auth.guard';

@Resolver('auth')
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Query(() => Available, {
		name: 'isAvailable',
		description: 'Check if the user is available',
	})
	async isAvailable(
		@Args('findUser', { type: () => FindUser }) findUser: FindUser
	): Promise<Available> {
		const user = await this.authService.findOne(findUser);

		if (user) return { available: false };

		return { available: true };
	}

	@Mutation(() => Status, {
		name: 'signup',
		description: 'send email contains token to be used for signing up',
	})
	async signup(
		@Args('user', { type: () => Signup }) signupUser: Signup
	): Promise<Status> {
		const status = await this.authService.sendSignupEmail(
			signupUser.email,
			signupUser.password,
			signupUser.birthDate
		);

		return { status: status.status, authenticated: null };
	}

	@Mutation(() => Status, {
		name: 'login',
		description: 'Validate account using the sended token',
	})
	async login(
		@Args('user', { type: () => Login }) login: Login,
		@Context('res') res: Response
	) {
		const user = await this.authService.login(login.email, login.password);

		if (user)
			res.cookie('token', user.token, {
				maxAge: 1000 * 60 * 60 * 24 * 7 * 12,
				httpOnly: true,
				sameSite: 'strict',
				secure: false,
			});

		return { status: 'Successfully logged in', authenticated: true };
	}

	@Query(() => Status, {
		name: 'logout',
		description: 'Check if the user is available',
	})
	@UseGuards(TokenAuthGuard)
	async logout(@Context('res') res: Response): Promise<Status> {
		res.clearCookie('token', { httpOnly: true });

		return { status: 'logged out', authenticated: false };
	}

	@Mutation(() => ForgotPassword, {
		name: 'forgotPassword',
		description: 'Validate account using the sended token',
	})
	async sendResetPasswordEmail(
		@Args('user', { type: () => Object }) resetPasswordEmail: { email: string }
	): Promise<Status> {
		await this.authService.sendResetPasswordEmail(resetPasswordEmail.email);

		return {
			status: 'Successfully send forgot password email',
			authenticated: null,
		};
	}

	@Mutation(() => Status, {
		name: 'resetPasswordToken',
		description: 'Email token to reset the password',
	})
	async verifyResetPassword(
		@Args('credentials', { type: () => String })
		credentials: ResetPasswordToken,

		@Context('res') res: Response
	): Promise<Status> {
		// console.log(credentials);
		const user = await this.authService.verifyResetPassword(credentials);

		if (user)
			res.cookie('token', user.token, {
				maxAge: 1000 * 60 * 60 * 24 * 7 * 12,
				httpOnly: true,
				sameSite: 'strict',
				secure: false,
			});
		return {
			status: 'Password has been updated successfully',
			authenticated: true,
		};
	}
}
