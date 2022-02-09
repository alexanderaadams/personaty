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
	// @Serialize(UserSignupResponse)
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
		return user.newUser;
	}

	@Post('is-available')
	async findOne(@Body() findUser: FindUser) {
		const user = await this.authService.findOne(findUser);

		if (user) return { available: false };

		return { available: true };
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

		return user.user;
	}

	@Post('forgot-password')
	async sendResetPasswordEmail(
		@Body() resetPasswordEmail: { email: string },
		@Res() res: Response
	) {
		console.log(resetPasswordEmail);
		await this.authService.sendResetPasswordEmail(resetPasswordEmail.email);
		return { status: 'email has been send' };
	}

	@Post('reset-password/:token')
	async verifyResetPassword(
		@Body()
		credentials: { password: string; confirmPassword: string; token: string },
		@Res({ passthrough: true }) res: Response
	) {
		console.log(credentials);
		const user = await this.authService.verifyResetPassword(credentials);

		res.cookie('token', user.token, {
			maxAge: 3600000 * 24 * 7 * 12,
			httpOnly: true,
			sameSite: 'strict',
			secure: false,
		});
		return user.updateUser;
	}

	@Post('verify-user')
	async verifyUser(
		@Body() verifyUser: { email: string },
		@Res() res: Response
	) {
		// await this.authService.resetPassword(verifyUser.email);
		return res.redirect('http://localhost:4200/auth/reset-password');
	}

	@Get('login-with-google')
	@UseGuards(AuthGuard('google'))
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	async googleAuth() {
		// return res.send;
	}

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
			maxAge: 3600000 * 24 * 7 * 12,
			httpOnly: true,
			sameSite: 'strict',
			secure: false,
		});
		return res.redirect('http://localhost:4200/home');
	}
}
