import { UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';

import { FindUser } from '../core/utilities/models/shared.model';
import { AuthService } from './auth.service';
import { IsUserAvailable } from './entities/is-user-available';
import { AuthenticationStatus } from './entities/authentication-status.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { sendForgotPasswordEmailDto } from './dto/forgot-password.dto';
import { ConfirmForgotPasswordDto } from './dto/confirm-forgot-password-with-token.dto';
import { MyJWTService } from '../jwt/jwt.service';
import { environment } from '../../environments/environment';
import { TokenAuthGuard } from '../core/guards/is-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { GqlThrottlerBehindProxyGuard } from '../core/guards/throttler/gql-throttler-behind-proxy.guard';
import { GqlThrottlerGuard } from '../core/guards/throttler/gql-throttler.guard';

@UseGuards(
	environment.production ? GqlThrottlerBehindProxyGuard : GqlThrottlerGuard
)
@Throttle(10, 180)
@Resolver('Auth')
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
				httpOnly: environment.COOKIE_ATTRIBUTE_HTTP_ONLY,
				sameSite: environment.COOKIE_ATTRIBUTE_SAME_SITE,
				secure: environment.COOKIE_ATTRIBUTE_SECURE,
				path: '/',
			});

		return { status: 'LOGGED_IN_SUCCESSFULLY', authenticated: true };
	}

	@Query(() => AuthenticationStatus, {
		name: 'logout',
		description: 'Check if the user is available',
	})
	@UseGuards(TokenAuthGuard)
	async logout(@Context('res') res: Response): Promise<AuthenticationStatus> {
		res.clearCookie('token', { httpOnly: true });

		return { status: 'LOGGED_OUT_SUCCESSFULLY', authenticated: false };
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
			return { status: 'CORRECTLY_AUTHENTICATED', authenticated: true };

		return { status: 'NOT_AUTHENTICATED', authenticated: false };
	}

	@Mutation(() => sendForgotPasswordEmailDto, {
		name: 'sendForgotPasswordEmail',
		description: 'Validate account using the sended token',
	})
	async sendForgotPasswordEmail(
		@Args('user', { type: () => Object })
		sendForgotPasswordEmail: { email: string },
		@Context('req') req: Request
	): Promise<AuthenticationStatus> {
		await this.authService.sendForgotPasswordEmail(
			sendForgotPasswordEmail.email,
			req.headers.origin
		);
		return {
			status: 'FORGOT_PASSWORD_EMAIL_SENT_SUCCESSFULLY',
			authenticated: null,
		};
	}

	@Mutation(() => AuthenticationStatus, {
		name: 'confirmForgotPassword',
		description: 'Email token to reset the password',
	})
	async confirmForgotPassword(
		@Args('credentials', { type: () => String })
		credentials: ConfirmForgotPasswordDto,

		@Context('res') res: Response
	): Promise<AuthenticationStatus> {
		// console.log(credentials);
		const user = await this.authService.confirmForgotPassword(credentials);

		if (user)
			res.cookie('token', user.token, {
				maxAge: 1000 * 60 * 60 * 24 * 7 * 12,
				httpOnly: environment.COOKIE_ATTRIBUTE_HTTP_ONLY,
				sameSite: environment.COOKIE_ATTRIBUTE_SAME_SITE,
				secure: environment.COOKIE_ATTRIBUTE_SECURE,
				path: '/',
			});
		return {
			status: 'PASSWORD_UPDATED_SUCCESSFULLY',
			authenticated: true,
		};
	}
}
