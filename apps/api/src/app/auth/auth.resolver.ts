import { UseGuards } from '@nestjs/common';
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
import { ConfirmForgotPasswordWithTokenDto } from './dto/confirm-forgot-password-with-token.dto';
import { MyJWTService } from '../jwt/jwt.service';
import { environment } from '../../environments/environment';
@Resolver('auth')
export class AuthResolver {
	constructor(
		private readonly authService: AuthService,
		private myJWTService: MyJWTService
	) {}

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
		@Args('user', { type: () => SignupDto }) signupUser: SignupDto,
		@Context('req') req: Request
	): Promise<AuthenticationStatus> {
		// console.log(req.headers);
		const status = await this.authService.sendSignupEmail(
			signupUser.email,
			signupUser.password,
			signupUser.birthDate,
			`${req.protocol}://${req.headers.host}`
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
				secure: environment.COOKIE_SECURE,
			});

		return { status: 'Successfully Logged in', authenticated: true };
	}

	@Query(() => AuthenticationStatus, {
		name: 'logout',
		description: 'Check if the user is available',
	})
	@UseGuards(TokenAuthGuard)
	async logout(@Context('res') res: Response): Promise<AuthenticationStatus> {
		res.clearCookie('token', { httpOnly: true });

		return { status: 'Successfully Logged out', authenticated: false };
	}

	@Query(() => AuthenticationStatus, {
		name: 'isAuthenticated',
		description:
			'Check if the user is Authenticated (Logged in and has working token)',
	})
	// @UseGuards(TokenAuthGuard)
	async isAuthenticated(
		@Context('req') req: Request
	): Promise<AuthenticationStatus> {
		const token = await this.myJWTService.verifyToken(req.cookies.token);
		// console.log('token', token, req.cookies.token);

		if (token)
			return { status: 'User is Correctly Authenticated', authenticated: true };

		return { status: 'User is Not Authenticated', authenticated: false };
	}

	@Mutation(() => ForgotPasswordDto, {
		name: 'forgotPassword',
		description: 'Validate account using the sended token',
	})
	async sendForgotPasswordEmail(
		@Args('user', { type: () => Object }) resetPasswordEmail: { email: string },
		@Context('req') req: Request
	): Promise<AuthenticationStatus> {
		await this.authService.sendForgotPasswordEmail(
			resetPasswordEmail.email,
			req.headers.origin
		);

		return {
			status: 'Successfully send forgot password email',
			authenticated: null,
		};
	}

	@Mutation(() => AuthenticationStatus, {
		name: 'resetPasswordToken',
		description: 'Email token to reset the password',
	})
	async verifyForgotPassword(
		@Args('credentials', { type: () => String })
		credentials: ConfirmForgotPasswordWithTokenDto,

		@Context('res') res: Response
	): Promise<AuthenticationStatus> {
		// console.log(credentials);
		const user = await this.authService.verifyForgotPassword(credentials);

		if (user)
			res.cookie('token', user.token, {
				maxAge: 1000 * 60 * 60 * 24 * 7 * 12,
				httpOnly: true,
				sameSite: 'strict',
				secure: environment.COOKIE_SECURE,
			});
		return {
			status: 'Password has been updated successfully',
			authenticated: true,
		};
	}
}
