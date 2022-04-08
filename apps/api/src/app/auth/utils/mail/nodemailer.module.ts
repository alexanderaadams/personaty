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
					host: 'smtp.mailtrap.io', // 'outlook.office365.com'
					port: 2525, //995
					secure: false,
					auth: {
						user: '9063ef07a10237', //'persona1335-613@hotmail.com'
						pass: '68c620d9e5780b', //'agg3sHE3#HRD4?LKdf472b-vxzznmBMRD25ah36'
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
