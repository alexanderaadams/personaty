import { AuthGuard } from '@nestjs/passport';
import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	Query,
	UseGuards,
	Param,
} from '@nestjs/common';
import {
	FindUser,
	GoogleOauth2,
	LoginUser,
	SignupUser,
	UserSignupResponse,
} from '../users/users.model';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Serialize } from '../users/interceptors/serialize.interceptor';
import { map } from 'rxjs';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	@Serialize(UserSignupResponse)
	async signup(
		@Body() user: SignupUser,
		@Res({ passthrough: true }) res: Response
	) {
		return (
			await this.authService.signup(
				user.username,
				user.email,
				user.password,
				user.date
			)
		).pipe(
			map((user) => {
				res.cookie('token', user.token, {
					maxAge: 3600000 * 24,
					httpOnly: true,
					sameSite: 'strict',
					secure: false,
				});
				return { username: user.user.username, email: user.user.email };
			})
		);
	}

	@Post('login')
	@Serialize(UserSignupResponse)
	login(@Body() user: LoginUser, @Res({ passthrough: true }) res: Response) {
		return this.authService.login(user.username, user.password).pipe(
			map(async (user) => {
				res.cookie('token', (await user).token, {
					maxAge: 3600000 * 24 * 7 * 12,
					httpOnly: true,
					sameSite: 'strict',
					secure: false,
				});
				// console.log(request.cookies);
				return {
					username: (await user).user.username,
					email: (await user).user.email,
				};
			})
		);
	}

	@Post('reset-password')
	resetPassword(@Body() user: { email: string }) {
		console.log(user);
		return this.authService.resetPassword(user.email);
	}

	@Post('reset-password/:username/:token')
	verifyResetPassword(
		@Param('username') username: string,
		@Param('token') token: string,
		@Body() passwords: { password: string; confirmPassword },
		@Res({ passthrough: true }) res: Response
	) {
		console.log(username, token, passwords);
		return this.authService
			.verifyResetPassword(username, token, passwords)
			.pipe(
				map((user) => {
					res.cookie('token', user.token, {
						maxAge: 3600000 * 24 * 7 * 12,
						httpOnly: true,
						sameSite: 'strict',
						secure: false,
					});
					return {
						username: user.user.username,
						email: user.user.email,
						password: user.user.password,
					};
				})
			);
	}

	@Post('user')
	findOne(@Body() user: FindUser) {
		return this.authService.findOne(user).pipe(
			map((res) => {
				if (res) return { available: false };

				return { available: true };
			})
		);
	}
	@Get('login-with-google')
	@UseGuards(AuthGuard('google'))
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	googleAuth() {}

	@Get('redirect')
	@UseGuards(AuthGuard('google'))
	googleAuthRedirect(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		return this.authService.googleOauth2Login(req.user as GoogleOauth2).pipe(
			map((user) => {
				res.cookie('token', user.token, {
					maxAge: 3600000 * 24 * 7 * 12,
					httpOnly: true,
					sameSite: 'strict',
					secure: false,
				});
				return res.redirect('http://localhost:3333/api/v1');
			})
		);
	}
}
