import {
	Injectable,
	HttpException,
	UnauthorizedException,
	NotFoundException,
	BadRequestException,
	ConflictException,
	BadGatewayException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { UserService } from '@features/user/user.service';
import { MyJWTService } from '@modules/jwt/jwt.service';
import { UserSensitiveInformation } from '@features/user/models/user-sensitive-information';
import { NodemailerService } from '@core/utils/mail/nodemailer.service';
import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';

import { GoogleOauth2 } from './models/google-oauth-2';
import { UserInfo } from '@core/models/user-info';
import { UserModel } from '@features/user/models/user-db/user-db.model';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UserService,
		private myJWTService: MyJWTService,
		private readonly nodemailerService: NodemailerService
	) {}

	@TryCatchWrapper()
	async hashingPassword(password: string) {
		// Hash the users password
		// Generate a salt
		const salt: string = randomBytes(32).toString('hex');
		// Hash the salt and the password together
		const hash: Buffer = (await scrypt(password, salt, 32)) as Buffer;
		// Join the hashed result and the salt together
		return salt + '.' + hash.toString('hex');
	}

	@TryCatchWrapper()
	async sendSignupEmailContainsAuthToken(
		email: string,
		password: string,
		birthDate: string,
		reqHeadersHost: string
	): Promise<{ status: string }> {
		const user: UserInfo | null = await this.usersService.findOne({ email });

		if (user) throw new ConflictException();

		const authToken: string = await this.myJWTService.signToken(
			{ email, password, birthDate },
			{
				expiresIn: '24h',
			}
		);

		const authTokenURL = `${reqHeadersHost}/api/v1/auth/signup/${authToken}`;

		console.log('email', email);

		this.nodemailerService.sendEmail(
			email,
			'Confirm Your Email Now!',
			'Click On The Button Bellow To Verify Your Email',
			authTokenURL
		);
		// const hashedPassword = await this.hashingPassword(password);
		// const newUser = await this.usersService.createUser({
		// 	email,
		// 	password: hashedPassword,
		// 	birthDate,
		// });
		return { status: 'SENT_SIGNUP_EMAIL_SUCCESSFULLY' };
		// return newUser;
	}

	@TryCatchWrapper()
	async signupToken(
		signupToken: string
	): Promise<{ user: UserInfo; authToken: string }> {
		const { email, password, birthDate } = await this.myJWTService.verifyToken(
			signupToken
		);

		const user: UserInfo | null = await this.usersService.findOne({ email });

		if (user) throw new ConflictException('User already exists');

		const hashedPassword: string = await this.hashingPassword(password);

		const newUser: UserInfo = await this.usersService.createUser({
			email,
			password: hashedPassword,
			birthDate,
			email_verified: true,
		});
		const authToken: string = await this.myJWTService.signToken({
			id: newUser._id.toString(),
			email,
		});

		return {
			user: newUser,
			authToken,
		};
	}

	@TryCatchWrapper()
	async login(
		email: string,
		password: string
	): Promise<{ user: UserSensitiveInformation; authToken: string }> {
		const user: UserSensitiveInformation | null =
			await this.usersService.getUserSensitiveInformation({
				email,
			});

		if (!user) throw new BadRequestException('Wrong Username or Password');

		const [salt, storedHash] = user.password.split('.');

		const hash: Buffer = (await scrypt(
			password,
			salt,
			32
		)) as unknown as Buffer;

		if (storedHash !== hash.toString('hex'))
			throw new UnauthorizedException('bad password');

		const authToken: string = await this.myJWTService.signToken({
			id: user._id.toString(),
			email,
		});

		return {
			user,
			authToken,
		};
	}

	@TryCatchWrapper()
	async findOne(user): Promise<UserInfo | null> {
		return await this.usersService.findOne(user);
	}

	@TryCatchWrapper()
	async googleOauth2Login(
		googleUser: GoogleOauth2
	): Promise<{ user?: UserInfo; newUser?: UserInfo; authToken: string }> {
		if (!googleUser) {
			throw new NotFoundException('Did not get any user from google');
		}

		const user: UserInfo | null = await this.usersService.findOne({
			email: googleUser.email,
		});

		if (user)
			return {
				user,
				authToken: await this.myJWTService.signToken({
					id: user._id,
					email: user.email,
				}),
			};

		// Generate a salt to store default password after oauth20
		const salt: string = randomBytes(32).toString('hex');

		const newUser: UserInfo = await this.usersService.createUser({
			...googleUser,
			password: salt,
		});

		return {
			newUser,
			authToken: await this.myJWTService.signToken({
				id: newUser._id.toString(),
				email: newUser.email,
			}),
		};
	}

	@TryCatchWrapper()
	async sendForgotPasswordEmail(
		email: string,
		reqHeadersOrigin: string
	): Promise<{ status: string }> {
		const user: UserInfo | null = await this.usersService.findOne({ email });

		if (!user) throw new NotFoundException();

		const authToken: string = await this.myJWTService.signToken(
			{ id: user._id.toString(), email: user.email },
			{
				expiresIn: '1h',
			}
		);

		const tokenURL = `${reqHeadersOrigin}/auth/confirm-forgot-password/${authToken}`;

		this.nodemailerService.sendEmail(
			email,
			'Forgot Your Password',
			'Click On The Button To Reset Your Password',
			tokenURL
		);
		return { status: 'Email has ben send' };
	}

	@TryCatchWrapper()
	async confirmForgotPassword(passwords: {
		password: string;
		confirmPassword: string;
		authToken: string;
	}): Promise<{ updateUser: UserInfo; authToken: string }> {
		const { password, confirmPassword, authToken } = passwords;

		if (password !== confirmPassword)
			throw new BadRequestException('Passwords Do Not Match');

		const verifyToken = await this.myJWTService.verifyToken(authToken);

		const user: UserModel | null = await this.usersService.findUserById(
			verifyToken.id
		);

		if (!user) throw new BadGatewayException('User Can Not Be Found');

		const signToken: string = await this.myJWTService.signToken({
			email: user.email,
		});

		const hashedPassword: string = await this.hashingPassword(password);

		const updateUser: UserInfo = await this.usersService.updateUser(user._id, {
			password: hashedPassword,
		});

		return {
			updateUser,
			authToken: signToken,
		};
	}
}
