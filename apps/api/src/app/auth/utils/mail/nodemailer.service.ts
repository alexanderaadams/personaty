import { HttpException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

// import * as url from './email';

@Injectable()
export class NodemailerService {
	constructor(private readonly mailerService: MailerService) {}

	public sendEmail(
		to: string,
		subject: string,
		text: string,
		tokenURL: string
	): void {
		// url(tokenURL);

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
	<img src="test.jpeg" alt="image" />
</div>
<div>
	<h3 style="color: rgb(80, 80, 80)">Confirm your email now !</h3>
	<p style="margin-bottom: 4rem; color: rgb(75, 75, 75)">
		Please lick on the button bellow to confirm your account
	</p>
</div>
<a
href=${tokenURL}
id="url"
style="
	text-decoration: none;
	background-color: #8a2be2;
	color: rgb(210, 210, 210);
	border-radius: 1rem;
	width: 8rem;
	padding: 1rem;
	text-align: center;
	font-weight: 600;
"
>Click To Confirm</a>
</div>`;
		this.mailerService
			.sendMail({
				to: to, // List of receivers email address
				from: 'persona1335-613@hotmail.com', // Senders email address
				subject: subject, // Subject line
				text: text, // plaintext body
				html: html, // HTML body content
			})
			.then((success) => {
				// console.log(success);
			})
			.catch((err) => {
				throw new HttpException(
					err?.message || err?.response?.message || 'Something Went Wrong',
					err?.status || err?.response?.statusCode || 500
				);
			});
	}
}
