import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { GoogleOauth2 } from './models/google-oauth-2';
import { environment } from '@environment';
import { ThrottlerBehindProxyGuard } from '@core/guards/throttler/throttler-behind-proxy.guard';

@UseGuards(environment.production ? ThrottlerBehindProxyGuard : ThrottlerGuard)
@Throttle(10, 180)
// @UseFilters(AllHttpExceptionsFilter)
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

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

	@Get('signup/:token')
	async signupToken(
		@Param('token') token: string,
		@Res({ passthrough: true }) res: Response
	) {
		const user = await this.authService.signupToken(token);

		if (user) {
			res.cookie('token', user.token, {
				maxAge: 3600000 * 24,
				httpOnly: environment.COOKIE_ATTRIBUTE_HTTP_ONLY,
				sameSite: environment.COOKIE_ATTRIBUTE_SAME_SITE,
				secure: environment.COOKIE_ATTRIBUTE_SECURE,
				path: '/',
			});
		}
		return res.redirect(`${environment.ORIGIN_URL}`);
	}

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

	// 	res.cookie('token', user.token, {
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
	// 	res.clearCookie('token', { httpOnly: true });
	// 	return { status: 'logged out', authenticated: false };
	// }

	// @Post('forgot-password')
	// async sendResetPasswordEmail(@Body() resetPasswordEmail: { email: string }) {
	// 	// console.log(resetPasswordEmail);
	// 	await this.authService.sendResetPasswordEmail(resetPasswordEmail.email);
	// 	return { status: 'email has been send' };
	// }

	// @Post('reset-password/:token')
	// async verifyResetPassword(
	// 	@Body()
	// 	credentials: { password: string; confirmPassword: string; token: string },
	// 	@Res({ passthrough: true }) res: Response
	// ) {
	// 	// console.log(credentials);
	// 	const user = await this.authService.verifyResetPassword(credentials);

	// 	res.cookie('token', user.token, {
	// maxAge: 3600000 * 24,
	// httpOnly: environment.COOKIE_ATTRIBUTE_HTTP_ONLY,
	// sameSite: environment.COOKIE_ATTRIBUTE_SAME_SITE,
	// secure: environment.COOKIE_ATTRIBUTE_SECURE,
	// 	});
	// 	return { user: user.updateUser, updatedUser: true };
	// }

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
		const user = await this.authService.googleOauth2Login(
			req.user as GoogleOauth2
		);

		res.cookie('token', user.token, {
			maxAge: 3600000 * 24,
			httpOnly: environment.COOKIE_ATTRIBUTE_HTTP_ONLY,
			sameSite: environment.COOKIE_ATTRIBUTE_SAME_SITE,
			secure: environment.COOKIE_ATTRIBUTE_SECURE,
			path: '/',
		});
		return res.redirect(`${environment.ORIGIN_URL}/auth/oauth2-success`);
	}
}
