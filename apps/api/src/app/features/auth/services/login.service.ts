import {
	Injectable,
	UnauthorizedException,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { MyJWTService } from '@modules/my-jwt/my-jwt.service';
import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';
import { ExposedUserModel } from '@core/models/exposed-user-model';
import { InjectedMongooseModelsService } from '@modules/injected-mongoose-models/injected-mongoose-models.service';

import { GoogleOauth2 } from '../models/google-oauth-2';
import { UserModel } from '../../user/models/user/user.model';

const scrypt = promisify(_scrypt);

@Injectable()
export class LoginService {
	constructor(
		private readonly myJWTService: MyJWTService,
		private readonly injectedMongooseModelsService: InjectedMongooseModelsService
	) {}

	@TryCatchWrapper()
	async credentialLogin(
		email: string,
		unhashedPassword: string
	): Promise<{ user: UserModel; auth: string }> {
		const user = (await this.injectedMongooseModelsService.userModel
			.findOne({
				email,
			})
			.select(' +password')
			.exec()) as unknown as UserModel | null;

		console.log(user);

		if (!user) throw new BadRequestException('Wrong Username or Password');

		const [salt, messageDigest] = user.password.split('.');

		const bufferedMessageDigest: Buffer = (await scrypt(
			unhashedPassword,
			salt,
			32
		)) as unknown as Buffer;

		if (messageDigest !== bufferedMessageDigest.toString('hex'))
			throw new UnauthorizedException('bad password');

		const authToken: string = await this.myJWTService.signToken({
			id: user.id,
			email,
		});

		return {
			user,
			auth: authToken,
		};
	}

	@TryCatchWrapper()
	async findOne(user: object): Promise<ExposedUserModel | null> {
		return await this.injectedMongooseModelsService.userModel.findOne(user);
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

		const user: ExposedUserModel | null =
			await this.injectedMongooseModelsService.userModel.findOne({
				email: googleUser.email,
			});

		if (user)
			return {
				user,
				auth: await this.myJWTService.signToken({
					id: user.id,
					email: user.email,
				}),
			};

		// Generate a salt to store default password after oauth20
		const salt: string = randomBytes(32).toString('hex');

		const newUser: ExposedUserModel =
			(await this.injectedMongooseModelsService.userModel.create({
				...googleUser,
				password: salt,
			})) as unknown as ExposedUserModel;

		return {
			newUser,
			auth: await this.myJWTService.signToken({
				id: newUser.id,
				email: newUser.email,
			}),
		};
	}
}
