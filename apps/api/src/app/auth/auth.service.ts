import { JWTService } from './../jwt/jwt.service';
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
import { GoogleOauth2 } from './auth.model';
import { UserExtraInfo } from '../user/user.model';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UserService,
		private myJWTService: JWTService,
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

	async sendSignupEmail(email: string, password: string, birthDate: string) {
		try {
			const user = await this.usersService.findOne({ email });

			if (user) throw new ConflictException();

			// const token = await this.myJWTService.signToken(
			// 	{ email, password, birthDate },
			// 	{
			// 		expiresIn: '15m',
			// 	}
			// );

			// const tokenURL = `http://localhost:3333/api/v1/auth/signup/${token}`;

			// this.nodemailerService.sendEmail(
			// 	email,
			// 	'Verify Your Email',
			// 	'Click On The Button To Verify Your Email',
			// 	tokenURL
			// );
			const hashedPassword = await this.hashingPassword(password);
			const newUser = await this.usersService.createUser({
				email,
				password: hashedPassword,
				birthDate,
			});
			return { status: 'Email Has Been Send, Check Your Email' };
			// return newUser;
		} catch (err) {
			throw new HttpException(
				err?.message || err?.response?.message || 'Something Went Wrong',
				err?.status || err?.response?.statusCode || 500
			);
		}
	}

	async signupToken(token: string) {
		const { username, email, password, birthDate } =
			await this.myJWTService.verifyToken(token);

		try {
			const user = await this.usersService.findOne({ username });

			if (user) throw new ConflictException('User already exists');

			const hashedPassword = await this.hashingPassword(password);

			const newUser = await this.usersService.createUser({
				username,
				email,
				password: hashedPassword,
				birthDate,
				email_verified: true,
			});
			const token = await this.myJWTService.signToken({
				id: newUser._id.toString(),
				username,
			});

			return {
				user: newUser,
				token,
			};
		} catch (err) {
			throw new HttpException(
				err?.message || err?.response?.message || 'Something Went Wrong',
				err?.status || err?.response?.statusCode || 500
			);
		}
	}

	async login(
		email: string,
		password: string
	): Promise<{ user: UserExtraInfo; token: string }> {
		try {
			const user = await this.usersService.getUserExtraInfo({ email });

			if (!user) throw new BadRequestException('Wrong Username or Password');

			const [salt, storedHash] = user.password.split('.');

			const hash = (await scrypt(password, salt, 32)) as unknown as Buffer;

			if (storedHash !== hash.toString('hex'))
				throw new UnauthorizedException('bad password');

			const token = await this.myJWTService.signToken({
				id: user._id.toString(),
				email,
			});
			// console.log(user._id.toString(), token);
			return {
				user,
				token,
			};
		} catch (err) {
			throw new HttpException(
				err?.message || err?.response?.message || 'Something Went Wrong',
				err?.status || err?.response?.statusCode || 500
			);
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
			// console.log(googleUser);

			const user = await this.usersService.findOne({ email: googleUser.email });

			if (user)
				return {
					user,
					token: await this.myJWTService.signToken({
						id: user._id,
						username: user.username,
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
					username: newUser.username,
				}),
			};
		} catch (err) {
			throw new HttpException(
				err?.message || err?.response?.message || 'Something Went Wrong',
				err?.status || err?.response?.statusCode || 500
			);
		}
	}

	async sendResetPasswordEmail(email: string) {
		try {
			const user = await this.usersService.findOne({ email });

			if (!user) throw new NotFoundException();

			const token = await this.myJWTService.signToken(
				{ id: user._id.toString(), username: user.username },
				{
					expiresIn: '15m',
				}
			);

			const tokenURL = `http://localhost:4200/auth/reset-password/${token}`;
			// console.log(user);
			this.nodemailerService.sendEmail(
				email,
				'Reset Your Password',
				'Click On The Button To Reset Your Password',
				tokenURL
			);
			return { status: 'Email has ben send' };
		} catch (err) {
			throw new HttpException(
				err?.message || err?.response?.message || 'Something Went Wrong',
				err?.status || err?.response?.statusCode || 500
			);
		}
	}

	async verifyResetPassword(passwords: {
		password: string;
		confirmPassword: string;
		token: string;
	}) {
		try {
			const { password, confirmPassword, token } = passwords;

			if (password !== confirmPassword)
				throw new BadRequestException('Passwords Does Not Match');

			const verifyToken = await this.myJWTService.verifyToken(token);

			const user = await this.usersService.findOne({
				id: verifyToken.id,
			});

			if (!user) throw new BadGatewayException('User Can Not Be Found');

			const signToken = await this.myJWTService.signToken({
				username: user.username,
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
			throw new HttpException(
				err?.message || err?.response?.message || 'Something Went Wrong',
				err?.status || err?.response?.statusCode || 500
			);
		}
	}
}
