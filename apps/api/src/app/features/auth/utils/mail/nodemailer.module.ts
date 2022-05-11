import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { NodemailerService } from './nodemailer.service';
import { environment } from '@environments/environment';

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: () => ({
				transport: {
					host: environment.NODEMAILER_EMAIL_HOST,
					port: environment.NODEMAILER_EMAIL_PORT,
					// secure: environment.NODEMAILER_SECURE_EMAIL_SERVICE,
					requireTLS: environment.NODEMAILER_SECURE_EMAIL_SERVICE,
					auth: {
						user: environment.NODEMAILER_EMAIL_USER,
						pass: environment.NODEMAILER_EMAIL_PASSWORD,
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
		}),
	],
	controllers: [],
	providers: [NodemailerService],
	exports: [NodemailerService],
})
export class NodemailerModule {}
