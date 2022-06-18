import {
	Injectable,
	UnauthorizedException,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { UserService } from '@features/user/user.service';
import { MyJWTService } from '@modules/my-jwt/my-jwt.service';
import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';
import { ExposedUserModel } from '@core/models/exposed-user-model';

import { GoogleOauth2 } from '../models/google-oauth-2';
import { ExposedUserModelSensitiveInformation } from '@features/user/models/exposed-user-model-sensitive-information';

const scrypt = promisify(_scrypt);

@Injectable()
export class LoginService {
	constructor(
		private readonly usersService: UserService,
		private readonly myJWTService: MyJWTService
	) {}

	@TryCatchWrapper()
	async credentialLogin(
		email: string,
		password: string
	): Promise<{ user: ExposedUserModelSensitiveInformation; auth: string }> {
		const user: ExposedUserModelSensitiveInformation | null =
			await this.usersService.getExposedUserModelSensitiveInformation({
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

		console.log(user._id.toString());

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
	async findOne(user): Promise<ExposedUserModel | null> {
		return await this.usersService.findOne(user);
	}

	@TryCatchWrapper()
	async googleOauth2Login(googleUser: GoogleOauth2): Promise<{
		user?: ExposedUserModel;
		newUser?: ExposedUserModel;
		auth: string;
	}> {
		if (!googleUser) {
			throw new NotFoundException('Did not get any user from google');
		}

		const user: ExposedUserModel | null = await this.usersService.findOne({
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

		const newUser: ExposedUserModel = await this.usersService.createUser({
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
}
