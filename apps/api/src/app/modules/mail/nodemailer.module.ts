import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { environment } from '@environment';

import { NodemailerService } from './nodemailer.service';

@Global()
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
					// debug: true, // show debug output
					// logger: true, // log information in console
				},
				defaults: {
					from: '"NoReplay" <user@outlook.com>', // outgoing email ID
				},
				template: {
					dir: join(
						process.cwd(),
						'apps',
						'api',
						'src',
						'app',
						'modules',
						'mail',
						'templates'
					),
					adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
					options: {
						strict: true,
					},
				},
			}),
		}),
	],
	providers: [NodemailerService],
	exports: [NodemailerService],
})
export class NodemailerModule {}
