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

import { UsersService } from '../users/users.service';
import { GoogleOauth2 } from '../users/users.model';
import { NodemailerService } from './utils/mail/nodemailer.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
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

	async signup(
		username: string,
		email: string,
		password: string,
		date: string | Date
	) {
		try {
			const hashedPassword = await this.hashingPassword(password);

			const user = await this.usersService.findOne({ username });

			if (user) throw new ConflictException('User already exists');

			const newUser = await this.usersService.createUser({
				username,
				email,
				password: hashedPassword,
				date,
			});
			const token = this.myJWTService.signToken({ username });

			return {
				newUser,
				token,
			};
		} catch (err) {
			throw new HttpException(
				err?.message || err?.response?.message || 'Something Went Wrong',
				err?.status || err?.response?.statusCode || 500
			);
		}
	}

	async login(username: string, password: string) {
		try {
			const user = await this.usersService.findOne({ username });

			if (!user) throw new BadRequestException('Wrong Username or Password');

			const [salt, storedHash] = user.password.split('.');

			const hash = (await scrypt(password, salt, 32)) as unknown as Buffer;

			if (storedHash !== hash.toString('hex'))
				throw new UnauthorizedException('bad password');

			const token = this.myJWTService.signToken({
				username,
			});

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
			console.log(googleUser);

			const user = await this.usersService.findOne({ email: googleUser.email });

			if (user)
				return {
					user,
					token: this.myJWTService.signToken({ username: user.username }),
				};

			// Generate a salt to store default password after oauth20
			const salt = randomBytes(32).toString('hex');

			const newUser = await this.usersService.createUser({
				...googleUser,
				password: salt,
				date: new Date(1970, 7, 7),
			});

			return {
				newUser,
				token: this.myJWTService.signToken({ username: newUser.username }),
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
			const token = this.myJWTService.signToken(
				{ username: user.username },
				{
					expiresIn: '15m',
				}
			);
			const tokenURL = `http://localhost:4200/auth/reset-password/${token}`;
			// console.log(user);
			this.nodemailerService.sendEmail(email, tokenURL);
			return { status: 'Email has ben send' };
		} catch (err) {
			throw new HttpException(
				err?.message || err?.response?.message || 'Something Went Wrong',
				err?.status || err?.response?.statusCode || 500
			);
		}
	}

	async sendVerificationEmail(email: string) {
		try {
			const user = await this.usersService.findOne({ email });

			if (!user || !user.email_verified)
				throw new BadGatewayException('Something Went Wrong');

			const token = this.myJWTService.signToken(
				{ username: user.username, email_verified: true },
				{
					expiresIn: '15m',
				}
			);
			// console.log(user);
			return `http://localhost:4200/auth/reset-password/${token}`;
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
				username: verifyToken.username,
			});

			if (!user) throw new BadGatewayException('User Can Not Be Found');

			const signToken = await this.myJWTService.signToken({
				username: user.username,
			});
			const hashedPassword = await this.hashingPassword(password);

			const updateUser = await this.usersService.updateUser(user.id, {
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
