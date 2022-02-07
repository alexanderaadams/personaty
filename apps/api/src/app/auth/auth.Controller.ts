import { AuthGuard } from '@nestjs/passport';
import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
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

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	@Serialize(UserSignupResponse)
	async signup(
		@Body() signupUser: SignupUser,
		@Res({ passthrough: true }) res: Response
	) {
		const user = await this.authService.signup(
			signupUser.username,
			signupUser.email,
			signupUser.password,
			signupUser.date
		);

		res.cookie('token', user.token, {
			maxAge: 3600000 * 24,
			httpOnly: true,
			sameSite: 'strict',
			secure: false,
		});
		return user;
	}

	@Post('login')
	@Serialize(UserSignupResponse)
	async login(
		@Body() loginUser: LoginUser,
		@Res({ passthrough: true }) res: Response
	) {
		const user = await this.authService.login(
			loginUser.username,
			loginUser.password
		);

		res.cookie('token', user.token, {
			maxAge: 3600000 * 24 * 7 * 12,
			httpOnly: true,
			sameSite: 'strict',
			secure: false,
		});

		return user;
	}

	@Post('reset-password')
	async resetPassword(@Body() resetPassword: { email: string }) {
		return await this.authService.resetPassword(resetPassword.email);
	}

	@Post('reset-password/:token')
	async verifyResetPassword(
		@Param('token') token: string,
		@Body() passwords: { password: string; confirmPassword },
		@Res({ passthrough: true }) res: Response
	) {
		const user = await this.authService.verifyResetPassword(token, passwords);

		res.cookie('token', user.token, {
			maxAge: 3600000 * 24 * 7 * 12,
			httpOnly: true,
			sameSite: 'strict',
			secure: false,
		});
		return user;
	}

	@Post('user')
	async findOne(@Body() findUser: FindUser) {
		const user = await this.authService.findOne(findUser);

		if (user) return { available: false };

		return { available: true };
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
		const user = await this.authService.googleOauth2Login(
			req.user as GoogleOauth2
		);

		res.cookie('token', user.token, {
			maxAge: 3600000 * 24 * 7 * 12,
			httpOnly: true,
			sameSite: 'strict',
			secure: false,
		});
		return res.redirect('http://localhost:3333/api/v1');
	}
}
