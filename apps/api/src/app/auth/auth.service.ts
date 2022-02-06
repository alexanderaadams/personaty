import { catchError } from 'rxjs/operators';
import { JWTService } from './../jwt/jwt.service';
import {
	Injectable,
	HttpException,
	UnauthorizedException,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { FindUser, GoogleOauth2, UserModel } from '../users/users.model';
// import * as bcrypt from 'bcrypt';
// import { environment } from 'apps/api/src/environments/environment';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const bcrypt = require('bcrypt');

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private myJWTService: JWTService
	) {}

	async signup(
		username: string,
		email: string,
		password: string,
		date: string
	) {
		// const ISODate = date.split('-');

		// Hash the users password

		// Generate a salt
		const salt = randomBytes(32).toString('hex');

		// Hash the salt and the password together
		const hash = (await scrypt(password, salt, 32)) as Buffer;

		// Join the hashed result and the salt together
		const hashedPassword = salt + '.' + hash.toString('hex');

		// Create a new user and save it
		return from(
			this.usersService.createUser({
				username,
				email,
				password: hashedPassword,
				date,
			})
		).pipe(
			map((user) => {
				return {
					user,
					token: this.myJWTService.signToken(user.username),
				};
			}),
			catchError((err: any) => {
				throw new HttpException(
					err?.response?.message || 'Something Went Wrong',
					err?.response?.statusCode || 500
				);
			})
		);
	}

	login(username: string, password: string) {
		return from(this.usersService.findOne({ username })).pipe(
			map(async (user) => {
				if (!user) throw new BadRequestException('Wrong Username or Password');
				const [salt, storedHash] = user.password.split('.');
				const hash = (await scrypt(password, salt, 32)) as unknown as Buffer;
				if (storedHash !== hash.toString('hex'))
					throw new UnauthorizedException('bad password');

				return {
					user,
					token: this.myJWTService.signToken(user.username),
				};
			}),
			catchError((err: any) => {
				throw new HttpException(
					err?.response?.message || 'Something Went Wrong',
					err?.response?.statusCode || 500
				);
			})
		);
	}

	findOne(user: FindUser): Observable<UserModel> {
		return this.usersService.findOne(user);
	}

	googleOauth2Login(googleUser: GoogleOauth2) {
		if (!googleUser) {
			throw new NotFoundException('Did not get any user from google');
		}

		return this.usersService.findOne({ email: googleUser.email }).pipe(
			switchMap((user) => {
				if (user) {
					return of({
						user,
						token: this.myJWTService.signToken(user.username),
					});
				}
				// Generate a salt to store default password after oauth20
				const salt = randomBytes(32).toString('hex');

				return this.usersService
					.createUser({
						...googleUser,
						password: salt,
						date: new Date(1970, 7, 7),
					})
					.pipe(
						map((user) => {
							return {
								user,
								token: this.myJWTService.signToken(user.username),
							};
						})
					);
			})
		);
	}

	resetPassword(email: string) {
		return this.usersService.findOne({ email }).pipe(
			map((user) => {
				if (!user) throw new NotFoundException();
				const token = this.myJWTService.signToken(user.username, {
					expiresIn: '15m',
				});

				console.log(user);
				return `http://localhost:3333/api/v1/auth/reset-password/${user.username}/${token}`;
			}),
			catchError((err: any) => {
				throw new HttpException(
					err.response?.message || 'Something Went Wrong',
					err?.response?.statusCode || 500
				);
			})
		);
	}

	verifyResetPassword(
		username: string,
		token: string,
		passwords: { password: string; confirmPassword: string }
	) {
		const { password, confirmPassword } = passwords;

		if (password !== confirmPassword)
			throw new BadRequestException('Passwords Does Not Match');

		return of(this.myJWTService.verifyToken(token)).pipe(
			switchMap((user: any) => {
				return this.usersService.findOne({ username }).pipe(
					switchMap((user) => {
						if (!user) throw new NotFoundException();
						return this.usersService.updateUser(user.id, { password }).pipe(
							map((user) => {
								return {
									user,
									token: this.myJWTService.signToken(user.username),
								};
							})
						);
					})
				);
			}),
			catchError((err: any) => {
				throw new HttpException(
					err.response?.message || 'Something Went Wrong',
					err?.response?.statusCode || 500
				);
			})
		);
	}
}
