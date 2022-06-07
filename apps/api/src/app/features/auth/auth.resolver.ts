import { UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { IsUserAvailable } from './models/is-user-available';
import { AuthenticationStatus } from './models/authentication-status';
import { SignupDto } from './models/dto/signup.dto';
import { LoginDto } from './models/dto/login.dto';
import { sendForgotPasswordEmailDto } from './models/dto/forgot-password.dto';

import { TokenAuthGuard } from '@core/guards/is-auth.guard';
import { GqlThrottlerBehindProxyGuard } from '@core/guards/throttler/gql-throttler-behind-proxy.guard';
import { GqlThrottlerGuard } from '@core/guards/throttler/gql-throttler.guard';
import { MyJWTService } from '@modules/jwt/jwt.service';
import { environment } from '@environment';
import { FindUser } from '@core/models/find-user';
import { ConfirmForgotPasswordDto } from './models/dto/confirm-forgot-password-with-token.dto';

@UseGuards(
	environment.production ? GqlThrottlerBehindProxyGuard : GqlThrottlerGuard
)
@Throttle(
	environment.THROTTLER_DEFAULT_TRYING_RATE_LIMIT,
	environment.THROTTLER_DEFAULT_TIME_TO_LIVE_LIMIT
)
// @UseFilters(GqlAllHttpExceptionFilter)
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
		description: 'send email contains authToken to be used for signing up',
	})
	async signup(
		@Args('user', { type: () => SignupDto }) signupUser: SignupDto,
		@Context('req') req: Request
	): Promise<AuthenticationStatus> {
		const { email, password, birthDate } = signupUser;

		const status = await this.authService.createSignupEmailContainsAuthToken({
			email,
			password,
			birthDate,
			requestHeadersHost: `${req?.protocol}://${req?.headers?.host}`,
		});

		return { status: status.status, authenticated: null };
	}

	@Mutation(() => AuthenticationStatus, {
		name: 'login',
		description: 'Validate account using the sended auth',
	})
	async login(
		@Args('user', { type: () => LoginDto }) login: LoginDto,
		@Context('res') res: Response
	) {
		const user = await this.authService.login(login.email, login.password);

		if (user)
			res.cookie('auth', user.auth, {
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
		res.clearCookie('auth', { httpOnly: true });

		return { status: 'LOGGED_OUT_SUCCESSFULLY', authenticated: false };
	}

	@Query(() => AuthenticationStatus, {
		name: 'isAuthenticated',
		description:
			'Check if the user is Authenticated (Logged in and has working authToken)',
	})
	async isAuthenticated(
		@Context('req') req: Request
	): Promise<AuthenticationStatus> {
		const authToken = await this.myJWTService.verifyToken(req?.cookies.auth);

		if (authToken)
			return { status: 'CORRECTLY_AUTHENTICATED', authenticated: true };

		return { status: 'NOT_AUTHENTICATED', authenticated: false };
	}

	@Mutation(() => sendForgotPasswordEmailDto, {
		name: 'sendForgotPasswordEmail',
		description: 'Validate account using the sended authToken',
	})
	async sendForgotPasswordEmail(
		@Args('user', { type: () => Object })
		sendForgotPasswordEmail: { email: string },
		@Context('req') req: Request
	): Promise<AuthenticationStatus> {
		await this.authService.sendForgotPasswordEmail(
			sendForgotPasswordEmail.email,
			req?.headers?.origin ?? ''
		);
		return {
			status: 'FORGOT_PASSWORD_EMAIL_SENT_SUCCESSFULLY',
			authenticated: null,
		};
	}

	@Mutation(() => AuthenticationStatus, {
		name: 'confirmForgotPassword',
		description: 'Validate the confirmPassword and Password and the authToken',
	})
	async confirmForgotPassword(
		@Args('credentials', { type: () => String })
		credentials: ConfirmForgotPasswordDto,

		@Context('res') res: Response
	): Promise<AuthenticationStatus> {
		const user = await this.authService.confirmForgotPassword(credentials);

		if (user)
			res.cookie('auth', user.auth, {
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
