import { Injectable, ConflictException } from '@nestjs/common';

import { UserService } from '@features/user/user.service';
import { MyJWTService } from '@modules/jwt/jwt.service';
import { NodemailerService } from '@modules/mail/nodemailer.service';
import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';

import { FileStorageService } from '@core/services/file-storage.service';
import { join } from 'path';
import { ExposedUserModel } from '@core/models/user-info';
import { HashingService } from './hashing.service';
import { ICreateSignupEmail } from '../interfaces/create-signup-email';

@Injectable()
export class SignupService {
	constructor(
		private readonly usersService: UserService,
		private readonly myJWTService: MyJWTService,
		private readonly nodemailerService: NodemailerService,
		private readonly fileStorageService: FileStorageService
	) {}

	@TryCatchWrapper()
	async createSignupEmail(
		signupUser: ICreateSignupEmail
	): Promise<{ status: string }> {
		const { email, password, birthDate, requestHeadersHost } = signupUser;

		const user: ExposedUserModel | null = await this.usersService.findOne({
			email,
		});

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
	async confirmSignupEmail(
		signupToken: string
	): Promise<{ user: ExposedUserModel; auth: string }> {
		const { email, password, birthDate } = await this.myJWTService.verifyToken(
			signupToken
		);

		const [user, hashedPassword] = await Promise.all([
			this.usersService.findOne({ email }),
			HashingService.hashingPassword(password),
		]);

		if (user) throw new ConflictException('User already exists');

		const newUser: ExposedUserModel = await this.usersService.createUser({
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
}
