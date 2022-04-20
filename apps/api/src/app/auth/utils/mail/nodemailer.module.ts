import { Module } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { environment } from '../../../../environments/environment';

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: () => ({
				transport: {
					host: environment.NODEMAILER_HOST,
					port: environment.NODEMAILER_PORT,
					secure: false,
					auth: {
						user: environment.NODEMAILER_USER,
						pass: environment.NODEMAILER_PASSWORD,
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
