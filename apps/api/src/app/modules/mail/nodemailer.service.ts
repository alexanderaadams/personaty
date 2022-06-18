import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { environment } from '@environment';
import { join } from 'path';
import { ISendEmail } from './models/send-email';

@Injectable()
export class NodemailerService {
	constructor(private readonly mailerService: MailerService) {}

	public sendEmail(sendEmailInfo: ISendEmail): void {
		const { to, subject, additionalInfo, authTokenURL } = sendEmailInfo;

		this.mailerService
			.sendMail({
				to: to,
				from: environment.production
					? environment.NODEMAILER_EMAIL_USER
					: 'NoReplay@mailtrap.io',

				subject: subject,
				text: additionalInfo.bodyText,
				template: 'confirmation', // `.hbs` extension is appended automatically
				attachments: [
					{
						filename: 'android-chrome-192x192-transparent.png',
						path: join(
							process.cwd(),
							'apps',
							'api',
							'src',
							'assets',
							'android-chrome-192x192-transparent.png'
						),
						cid: 'personaLogo', //same cid value as in the html img src
					},
				],
				context: {
					// ✏️ filling curly brackets with content
					bodyText: additionalInfo.bodyText,
					buttonText: additionalInfo.buttonText,
					expiresDate: additionalInfo.expiresDate,
					creationConfirmation: additionalInfo.creationConfirmation ?? null,
					authTokenURL,
				},
			})
			.then(() => {
				// console.log('res', res);
			})
			.catch((err) => {
				return err;
			});
	}
}
