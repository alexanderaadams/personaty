import { Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';

import { FindUser } from '../core/shared.model';

import { AuthService } from './auth.service';
import { TokenAuthGuard } from '../utils/guards/is-auth.guard';

import { IsUserAvailable } from './entities/is-user-available';
import { AuthenticationStatus } from './entities/authentication-status.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordWithTokenDto } from './dto/reset-password-with-token.dto';
@Resolver('auth')
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Query(() => IsUserAvailable, {
		name: 'isAvailable',
		description: 'Check if the user is available',
	})
	async isAvailable(
		@Args('findUser', { type: () => FindUser }) findUser: FindUser
	): Promise<IsUserAvailable> {
		const user = await this.authService.findOne(findUser);

		if (user) return { available: false };

		return { available: true };
	}

	@Mutation(() => AuthenticationStatus, {
		name: 'signup',
		description: 'send email contains token to be used for signing up',
	})
	async signup(
		@Args('user', { type: () => SignupDto }) signupUser: SignupDto
	): Promise<AuthenticationStatus> {
		const status = await this.authService.sendSignupEmail(
			signupUser.email,
			signupUser.password,
			signupUser.birthDate
		);

		return { status: status.status, authenticated: null };
	}

	@Mutation(() => AuthenticationStatus, {
		name: 'login',
		description: 'Validate account using the sended token',
	})
	async login(
		@Args('user', { type: () => LoginDto }) login: LoginDto,
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

	@Query(() => AuthenticationStatus, {
		name: 'logout',
		description: 'Check if the user is available',
	})
	@UseGuards(TokenAuthGuard)
	async logout(@Context('res') res: Response): Promise<AuthenticationStatus> {
		res.clearCookie('token', { httpOnly: true });

		return { status: 'logged out', authenticated: false };
	}

	@Mutation(() => ForgotPasswordDto, {
		name: 'forgotPassword',
		description: 'Validate account using the sended token',
	})
	async sendResetPasswordEmail(
		@Args('user', { type: () => Object }) resetPasswordEmail: { email: string }
	): Promise<AuthenticationStatus> {
		await this.authService.sendResetPasswordEmail(resetPasswordEmail.email);

		return {
			status: 'Successfully send forgot password email',
			authenticated: null,
		};
	}

	@Mutation(() => AuthenticationStatus, {
		name: 'resetPasswordToken',
		description: 'Email token to reset the password',
	})
	async verifyResetPassword(
		@Args('credentials', { type: () => String })
		credentials: ResetPasswordWithTokenDto,

		@Context('res') res: Response
	): Promise<AuthenticationStatus> {
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
