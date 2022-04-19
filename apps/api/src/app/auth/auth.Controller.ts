import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { AuthService } from './auth.service';
import { Serialize } from '../user/interceptors/serialize.interceptor';
import { GoogleOauth2 } from './entities/google-oauth-2.entity';
import { FindUser } from '../core/shared.model';
import { AuthGuard } from '@nestjs/passport';
import { TokenAuthGuard } from '../utils/guards/is-auth.guard';

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
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request
	) {
		const user = await this.authService.signupToken(token);

		if (user) {
			res.cookie('token', user.token, {
				maxAge: 3600000 * 24,
				httpOnly: true,
				sameSite: 'strict',
				secure: false,
			});
		}
		return res.redirect(`${req.headers.origin}/home`);
	}

	@Post('is-available')
	async findOne(@Body() findUser: FindUser) {
		const user = await this.authService.findOne(findUser);

		if (user) return { available: false };

		return { available: true };
	}

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
	// 		maxAge: 3600000 * 24 * 7 * 12,
	// 		httpOnly: true,
	// 		sameSite: 'strict',
	// 		secure: false,
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
	// 		maxAge: 1000 * 60 * 60 * 24 * 7 * 12,
	// 		httpOnly: true,
	// 		sameSite: 'strict',
	// 		secure: false,
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
		// console.log(user, req.user);
		res.cookie('token', user.token, {
			maxAge: 1000 * 60 * 60 * 24 * 7 * 12,
			httpOnly: true,
			sameSite: 'strict',
			secure: false,
		});
		return res.redirect(`${req.headers.origin}/auth/success`);
	}
}
