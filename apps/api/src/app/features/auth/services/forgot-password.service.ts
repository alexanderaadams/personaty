import {
	Injectable,
	NotFoundException,
	BadRequestException,
	BadGatewayException,
} from '@nestjs/common';

import { UserService } from '@features/user/user.service';
import { MyJWTService } from '@modules/my-jwt/my-jwt.service';
import { NodemailerService } from '@modules/mail/nodemailer.service';
import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';
import { ExposedUserModel } from '@core/models/exposed-user-model';

import { HashingService } from './hashing.service';
import { InjectedMongooseModelsService } from '@modules/injected-mongoose-models/injected-mongoose-models.service';

@Injectable()
export class ForgotPasswordService {
	constructor(
		private readonly userService: UserService,
		private readonly myJWTService: MyJWTService,
		private readonly nodemailerService: NodemailerService,
		private readonly injectedMongooseModelsService: InjectedMongooseModelsService
	) {}

	@TryCatchWrapper()
	async sendEmailToResetPassword(
		email: string,
		requestHeadersOrigin: string
	): Promise<{ status: string }> {
		const user: ExposedUserModel | null = await this.userService.findOne({
			email,
		});

		if (!user) throw new NotFoundException();

		const authToken: string = await this.myJWTService.signToken(
			{ id: user.id, email: user.email },
			{
				expiresIn: '1h',
			}
		);

		const authTokenURL = `${requestHeadersOrigin}/auth/confirm-new-password/${authToken}`;

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
	async confirmNewPassword(passwords: {
		password: string;
		confirmPassword: string;
		authToken: string;
	}): Promise<any> {
		const { password, confirmPassword, authToken } = passwords;

		if (password !== confirmPassword)
			throw new BadRequestException('Passwords Do Not Match');

		const verifyToken = await this.myJWTService.verifyToken(authToken);

		const user: ExposedUserModel | null =
			await this.injectedMongooseModelsService.userModel.findById(
				verifyToken.id
			);

		if (!user) throw new BadGatewayException('User Can Not Be Found');

		const [newAuthToken, hashedPassword] = await Promise.all([
			this.myJWTService.signToken({
				email: user.email,
			}),
			HashingService.messageDigest(password),
		]);

		// const updateUser = (await this.userService
		// 	.updateUser(
		// 		user.id,
		// 		{ password: hashedPassword, updatedAt: Date.now() },
		// 		{
		// 			new: true,
		// 		}
		// 	)
		// 	.exec()) as unknown as ExposedUserModel;

		// return {
		// updateUser,
		// auth: newAuthToken,
		// };
	}
}
