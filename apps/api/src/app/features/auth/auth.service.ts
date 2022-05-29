import {
	Injectable,
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
import { NodemailerService } from '@modules/mail/nodemailer.service';
import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';

import { GoogleOauth2 } from './models/google-oauth-2';
import { UserInfo } from '@core/models/user-info';
import { UserModel } from '@features/user/models/user/user.model';
import { ISendSignupEmailContainsAuthToken } from './models/dto/send-signup-email-contains-auth-token';
import { FileStorageService } from '../../core/utils/file-storage.service';
import { join } from 'path';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UserService,
		private readonly myJWTService: MyJWTService,
		private readonly nodemailerService: NodemailerService,
		private readonly fileStorageService: FileStorageService
	) {}

	@TryCatchWrapper()
	async hashingPassword(password: string): Promise<string> {
		// Hash the users password
		// Generate a salt
		const salt: string = randomBytes(32).toString('hex');
		// Hash the salt and the password together
		const hash: Buffer = (await scrypt(password, salt, 32)) as Buffer;
		// Join the hashed result and the salt together
		return salt + '.' + hash.toString('hex');
	}

	@TryCatchWrapper()
	async createSignupEmailContainsAuthToken(
		signupUser: ISendSignupEmailContainsAuthToken
	): Promise<{ status: string }> {
		const { email, password, birthDate, requestHeadersHost } = signupUser;

		const user: UserInfo | null = await this.usersService.findOne({ email });

		if (user) throw new ConflictException();

		const authToken: string = await this.myJWTService.signToken(
			{ email, password, birthDate },
			{
				expiresIn: '24h',
			}
		);

		const authTokenURL = `${requestHeadersHost}/api/v1/auth/signup/${authToken}`;

		this.nodemailerService.sendEmail({
			to: email,
			subject: 'Confirm Your Email Now!',
			additionalInfo: {
				bodyText:
					'Please confirm your email address by clicking on the button bellow.',
				expiresDate: '24 hour',
				creationConfirmation: '',
				buttonText: 'Confirm your email',
			},
			authTokenURL: authTokenURL,
		});
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
	async confirmSignupWithAuthToken(
		signupToken: string
	): Promise<{ user: UserInfo; auth: string }> {
		const { email, password, birthDate } = await this.myJWTService.verifyToken(
			signupToken
		);

		const [user, hashedPassword] = await Promise.all([
			this.usersService.findOne({ email }),
			this.hashingPassword(password),
		]);

		if (user) throw new ConflictException('User already exists');

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

		this.fileStorageService.makeDirectoryIfDoesNotExist({
			idFolderPath: join(process.cwd(), 'upload', newUser._id.toString()),
			folderType: ['images', 'videos'],
			folderName: ['story', 'profile'],
		});

		return {
			user: newUser,
			auth: authToken,
		};
	}

	@TryCatchWrapper()
	async login(
		email: string,
		password: string
	): Promise<{ user: UserSensitiveInformation; auth: string }> {
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
			auth: authToken,
		};
	}

	@TryCatchWrapper()
	async findOne(user): Promise<UserInfo | null> {
		return await this.usersService.findOne(user);
	}

	@TryCatchWrapper()
	async googleOauth2Login(
		googleUser: GoogleOauth2
	): Promise<{ user?: UserInfo; newUser?: UserInfo; auth: string }> {
		if (!googleUser) {
			throw new NotFoundException('Did not get any user from google');
		}

		const user: UserInfo | null = await this.usersService.findOne({
			email: googleUser.email,
		});

		if (user)
			return {
				user,
				auth: await this.myJWTService.signToken({
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
			auth: await this.myJWTService.signToken({
				id: newUser._id.toString(),
				email: newUser.email,
			}),
		};
	}

	@TryCatchWrapper()
	async sendForgotPasswordEmail(
		email: string,
		requestHeadersOrigin: string
	): Promise<{ status: string }> {
		const user: UserInfo | null = await this.usersService.findOne({ email });

		if (!user) throw new NotFoundException();

		const authToken: string = await this.myJWTService.signToken(
			{ id: user._id.toString(), email: user.email },
			{
				expiresIn: '1h',
			}
		);

		const authTokenURL = `${requestHeadersOrigin}/auth/confirm-forgot-password/${authToken}`;

		this.nodemailerService.sendEmail({
			to: email,
			subject: 'Forgot Your Password',
			additionalInfo: {
				bodyText: 'Reset your password by clicking on the button bellow.',
				expiresDate: '1 hour',
				buttonText: 'Reset your password',
			},
			authTokenURL: authTokenURL,
		});

		return { status: 'Email has ben send' };
	}

	@TryCatchWrapper()
	async confirmForgotPassword(passwords: {
		password: string;
		confirmPassword: string;
		authToken: string;
	}): Promise<{ updateUser: UserInfo; auth: string }> {
		const { password, confirmPassword, authToken } = passwords;

		if (password !== confirmPassword)
			throw new BadRequestException('Passwords Do Not Match');

		const verifyToken = await this.myJWTService.verifyToken(authToken);

		const user: UserModel | null = await this.usersService.findUserById(
			verifyToken.id
		);

		if (!user) throw new BadGatewayException('User Can Not Be Found');

		const newAuthToken: string = await this.myJWTService.signToken({
			email: user.email,
		});

		const hashedPassword: string = await this.hashingPassword(password);

		const updateUser: UserInfo = await this.usersService.updateUser(user._id, {
			password: hashedPassword,
		});

		return {
			updateUser,
			auth: newAuthToken,
		};
	}
}
