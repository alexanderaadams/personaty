import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { GoogleOauth2 } from './models/google-oauth-2';
import { environment } from '@environment';
import { ThrottlerBehindProxyGuard } from '@core/guards/throttler/throttler-behind-proxy.guard';

import { SignupService } from './services/signup.service';
import { LoginService } from './services/login.service';
import { InjectedMongooseModelsService } from '@modules/injected-mongoose-models/injected-mongoose-models.service';
import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';

@UseGuards(environment.production ? ThrottlerBehindProxyGuard : ThrottlerGuard)
@Throttle(
	environment.THROTTLER_DEFAULT_TRYING_RATE_LIMIT,
	environment.THROTTLER_DEFAULT_TIME_TO_LIVE_LIMIT
)
@Controller('auth')
export class AuthController {
	constructor(
		private readonly signupService: SignupService,
		private readonly loginService: LoginService,
		private injectedMongooseModelsService: InjectedMongooseModelsService
	) {}

	@Get('signup/:authToken')
	async signupToken(
		@Param('authToken') authToken: string,
		@Res({ passthrough: true }) res: Response
	) {
		const user = await this.signupService.confirmSignupEmail(authToken);

		if (user) {
			res.cookie('auth', user.auth, {
				maxAge: 3600000 * 24,
				httpOnly: environment.COOKIE_ATTRIBUTE_HTTP_ONLY,
				sameSite: environment.COOKIE_ATTRIBUTE_SAME_SITE,
				secure: environment.COOKIE_ATTRIBUTE_SECURE,
				path: '/',
			});
		}
		return res.redirect(environment.ORIGIN_URL);
	}

	@Get('login-with-google')
	@UseGuards(AuthGuard('google'))
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	async googleAuth() {}

	@Get('redirect')
	@UseGuards(AuthGuard('google'))
	async googleAuthRedirect(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const user = await this.loginService.googleOauth2Login(
			req.user as GoogleOauth2
		);

		res.cookie('auth', user.auth, {
			maxAge: 3600000 * 24,
			httpOnly: environment.COOKIE_ATTRIBUTE_HTTP_ONLY,
			sameSite: environment.COOKIE_ATTRIBUTE_SAME_SITE,
			secure: environment.COOKIE_ATTRIBUTE_SECURE,
			path: '/',
		});
		return res.redirect(`${environment.ORIGIN_URL}/auth/oauth2-success`);
	}

	// @Post('signup')
	// // @Serialize(UserSignupResponse)
	// async signup(@Body() signupUser: SignupUser, @Res() res: Response) {
	// 	const status = await this.authService.sendSignupEmail(
	// 		signupUser.email,
	// 		signupUser.password,
	// 		signupUser.birthDate
	// 	);

	// 	return status;
	// }

	// @Post('is-available')
	// async findOne(@Body() findUser: FindUser) {
	// 	const user = await this.authService.findOne(findUser);

	// 	if (user) return { available: false };

	// 	return { available: true };
	// }

	// @Post('login')
	// // @Serialize(UserSignupResponse)
	// async login(
	// 	@Body() loginUser: LoginUser,
	// 	@Res({ passthrough: true }) res: Response
	// ) {
	// 	const user = await this.authService.login(
	// 		loginUser.username,
	// 		loginUser.password
	// 	);

	// 	res.cookie('auth', user.auth, {
	// maxAge: 3600000 * 24,
	// httpOnly: environment.COOKIE_ATTRIBUTE_HTTP_ONLY,
	// sameSite: environment.COOKIE_ATTRIBUTE_SAME_SITE,
	// secure: environment.COOKIE_ATTRIBUTE_SECURE,
	// 	});

	// 	return { user: user.user, Authenticated: true };
	// }

	// @Get('logout')
	// @UseGuards(TokenAuthGuard)
	// async logout(@Res({ passthrough: true }) res: Response) {
	// 	res.clearCookie('auth', { httpOnly: true });
	// 	return { status: 'logged out', authenticated: false };
	// }

	// @Post('forgot-password')
	// async sendResetPasswordEmail(@Body() resetPasswordEmail: { email: string }) {

	// 	await this.authService.sendResetPasswordEmail(resetPasswordEmail.email);
	// 	return { status: 'email has been send' };
	// }

	// @Post('reset-password/:authToken')
	// async verifyResetPassword(
	// 	@Body()
	// 	credentials: { password: string; confirmPassword: string; authToken: string },
	// 	@Res({ passthrough: true }) res: Response
	// ) {

	// 	const user = await this.authService.verifyResetPassword(credentials);

	// 	res.cookie('auth', user.auth, {
	// maxAge: 3600000 * 24,
	// httpOnly: environment.COOKIE_ATTRIBUTE_HTTP_ONLY,
	// sameSite: environment.COOKIE_ATTRIBUTE_SAME_SITE,
	// secure: environment.COOKIE_ATTRIBUTE_SECURE,
	// 	});
	// 	return { user: user.updateUser, updatedUser: true };
	// }
}
