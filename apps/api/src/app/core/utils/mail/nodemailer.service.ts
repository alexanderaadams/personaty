import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { environment } from '@environment';

@Injectable()
export class NodemailerService {
	constructor(private readonly mailerService: MailerService) {}

	public sendEmail(
		to: string,
		subject: string,
		text: string,
		authTokenURL: string
	): void {
		console.log('to', to);

		const html = `		<div
style="
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-color: snow;
	font-family: sans-serif;
	align-items: center;
	align-content: space-between;
"
>
<div style="display: flex; justify-content: center">
</div>
<div>
	<h3 style="color: rgb(80, 80, 80)">Confirm your email now !</h3>
	<p style="margin-bottom: 4rem; color: rgb(75, 75, 75)">
		Please click on the button bellow to confirm your account
	</p>
</div>
<a
href=${authTokenURL}
id="url"
style="
	text-decoration: none;
	background-color: #020202;
	color: #ddd;
	border-radius: 1rem;
	width: 8rem;
	padding: 1rem;
	text-align: center;
	font-weight: 600;
"
>Click Here</a>
</div>`;
		this.mailerService
			.sendMail({
				to: to, // List of receivers email address
				from: environment.NODEMAILER_EMAIL_USER,
				//No-Reply@hotmail.com', // Senders email address
				subject: subject, // Subject line
				text: text, // plaintext body
				html: html, // HTML body content
			})
			.catch((err) => {
				return err;
			});
	}
}
