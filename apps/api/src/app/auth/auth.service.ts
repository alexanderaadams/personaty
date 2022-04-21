import { MyJWTService } from './../jwt/jwt.service';
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

import { UserService } from '../user/user.service';
import { NodemailerService } from './utils/mail/nodemailer.service';
import { GoogleOauth2 } from './entities/google-oauth-2.entity';

import { UserSensitiveInformation } from '../user/entities/user-sensitive-information.entity';
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UserService,
		private myJWTService: MyJWTService,
		private readonly nodemailerService: NodemailerService
	) {}

	async hashingPassword(password: string) {
		try {
			// Hash the users password
			// Generate a salt
			const salt = randomBytes(32).toString('hex');
			// Hash the salt and the password together
			const hash = (await scrypt(password, salt, 32)) as Buffer;
			// Join the hashed result and the salt together
			return salt + '.' + hash.toString('hex');
		} catch (_) {
			throw new BadGatewayException('Something Went Wrong');
		}
	}

	async sendSignupEmail(
		email: string,
		password: string,
		birthDate: string,
		reqHeadersHost: string
	) {
		try {
			const user = await this.usersService.findOne({ email });

			if (user) throw new ConflictException();

			const token = await this.myJWTService.signToken(
				{ email, password, birthDate },
				{
					expiresIn: '30m',
				}
			);

			const tokenURL = `${reqHeadersHost}/api/v1/auth/signup/${token}`;

			this.nodemailerService.sendEmail(
				email,
				'Confirm Your Email',
				'Click On The Button To Verify Your Email',
				tokenURL
			);
			// const hashedPassword = await this.hashingPassword(password);
			// const newUser = await this.usersService.createUser({
			// 	email,
			// 	password: hashedPassword,
			// 	birthDate,
			// });
			return { status: 'Email Has Been Send, Check Your Email' };
			// return newUser;
		} catch (err) {
			throw new HttpException('Something Went Wrong', 500);
		}
	}

	async signupToken(token: string) {
		const { email, password, birthDate } = await this.myJWTService.verifyToken(
			token
		);

		try {
			const user = await this.usersService.findOne({ email });

			if (user) throw new ConflictException('User already exists');

			const hashedPassword = await this.hashingPassword(password);

			const newUser = await this.usersService.createUser({
				email,
				password: hashedPassword,
				birthDate,
				email_verified: true,
			});
			const token = await this.myJWTService.signToken({
				id: newUser._id.toString(),
				email,
			});

			return {
				user: newUser,
				token,
			};
		} catch (err) {
			throw new HttpException('Something Went Wrong', 500);
		}
	}

	async login(
		email: string,
		password: string
	): Promise<{ user: UserSensitiveInformation; token: string }> {
		try {
			const user = await this.usersService.getUserSensitiveInformation({
				email,
			});

			if (!user) throw new BadRequestException('Wrong Username or Password');

			const [salt, storedHash] = user.password.split('.');

			const hash = (await scrypt(password, salt, 32)) as unknown as Buffer;

			if (storedHash !== hash.toString('hex'))
				throw new UnauthorizedException('bad password');

			const token = await this.myJWTService.signToken({
				id: user._id.toString(),
				email,
			});

			return {
				user,
				token,
			};
		} catch (err) {
			throw new HttpException('Something Went Wrong', 500);
		}
	}

	async findOne(user) {
		return await this.usersService.findOne(user);
	}

	async googleOauth2Login(googleUser: GoogleOauth2) {
		try {
			if (!googleUser) {
				throw new NotFoundException('Did not get any user from google');
			}

			const user = await this.usersService.findOne({ email: googleUser.email });

			if (user)
				return {
					user,
					token: await this.myJWTService.signToken({
						id: user._id,
						email: user.email,
					}),
				};

			// Generate a salt to store default password after oauth20
			const salt = randomBytes(32).toString('hex');

			const newUser = await this.usersService.createUser({
				...googleUser,
				password: salt,
			});

			return {
				newUser,
				token: await this.myJWTService.signToken({
					id: user._id.toString(),
					email: newUser.email,
				}),
			};
		} catch (err) {
			throw new HttpException('Something Went Wrong', 500);
		}
	}

	async sendForgotPasswordEmail(email: string, reqHeadersOrigin: string) {
		try {
			const user = await this.usersService.findOne({ email });

			if (!user) throw new NotFoundException();

			const token = await this.myJWTService.signToken(
				{ id: user._id.toString(), email: user.email },
				{
					expiresIn: '30m',
				}
			);

			const tokenURL = `${reqHeadersOrigin}/auth/reset-password/${token}`;
			// console.log(user);
			this.nodemailerService.sendEmail(
				email,
				'Forgot Your Password',
				'Click On The Button To Forgot Your Password',
				tokenURL
			);
			return { status: 'Email has ben send' };
		} catch (err) {
			throw new HttpException('Something Went Wrong', 500);
		}
	}

	async verifyForgotPassword(passwords: {
		password: string;
		confirmPassword: string;
		token: string;
	}) {
		try {
			const { password, confirmPassword, token } = passwords;

			if (password !== confirmPassword)
				throw new BadRequestException('Passwords Does Not Match');

			const verifyToken = await this.myJWTService.verifyToken(token);

			const user = await this.usersService.findUserById(verifyToken.id);

			if (!user) throw new BadGatewayException('User Can Not Be Found');

			const signToken = await this.myJWTService.signToken({
				email: user.email,
			});
			const hashedPassword = await this.hashingPassword(password);

			const updateUser = await this.usersService.updateUser(user._id, {
				password: hashedPassword,
			});

			return {
				updateUser,
				token: signToken,
			};
		} catch (err) {
			throw new HttpException('Something Went Wrong', 500);
		}
	}
}
