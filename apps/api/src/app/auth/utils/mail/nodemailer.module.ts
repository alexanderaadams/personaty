import { Module } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { environment } from '../../../../environments/environment';

@Module({
	imports: [
		MailerModule.forRoot({
			transport: {
				host: 'smtp.mailtrap.io',
				port: 2525,
				secure: false,
				auth: {
					user: '9063ef07a10237',
					pass: '68c620d9e5780b',
				},
			},
			defaults: {
				from: '"nest-modules" <user@outlook.com>', // outgoing email ID
			},
			template: {
				dir: __dirname,
				adapter: new HandlebarsAdapter(), // or new PugAdapter()
				options: {
					strict: true,
				},
			},
		}),
	],
	controllers: [],
	providers: [NodemailerService],
	exports: [NodemailerService],
})
export class NodemailerModule {}
