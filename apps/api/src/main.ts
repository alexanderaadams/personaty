import { Logger, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as hpp from 'hpp';
import * as csurf from 'csurf';
import * as compression from 'compression';
import * as mongoSanitize from 'express-mongo-sanitize';

import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
// import { graphqlUploadExpress } from 'graphql-upload';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

process.on('uncaughtException', (err: Error): void => {
	Logger.error('UNCAUGHT EXCEPTION! 💥');
	Logger.error(err?.name ?? 'Error', err?.message ?? 'Something went wrong');
});

process.on(
	'unhandledRejection',
	(
		reason: Record<string, unknown> | null | undefined,
		promise: Promise<unknown>
	) => {
		Logger.error('UNHANDLED REJECTION! 💥 ');
		Logger.error(reason);
		Logger.error(
			reason?.name ?? 'Error',
			reason?.message ?? 'Something went wrong'
		);
	}
);

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true,
	});

	const whitelist = [environment.HOST_URL, environment.ORIGIN_URL, undefined];
	const globalPrefix = 'api/v1';

	const corsOptions = {
		origin: function (origin: any, callback: any): any {
			if (whitelist.indexOf(origin) !== -1) return callback(null, true);

			throw new UnauthorizedException('Not allowed by CORS');
		},
		methods: environment.CORS_METHOD_HEADERS,
		exposedHeaders: environment.CORS_EXPOSED_HEADERS,

		credentials: true,
	};

	// CORS configuration
	app.enableCors(corsOptions);

	// Configuration for file size using graphql
	app.use(
		'/graphql',
		graphqlUploadExpress({
			maxFileSize: 500000,
			maxFiles: 1,
		})
	);

	app.use(cookieParser());

	// Data pollution protection
	app.use(hpp());

	//
	app.use(compression());

	//	Data sanitization against NoSql query injection
	app.use(mongoSanitize());

	// Data sanitization against XSS

	// heroku works behind a proxy
	// if (environment.production) {
	// app.set('trust proxy', 1);

	// A wide range of protection policies
	app.use(
		helmet({
			frameguard: { action: 'DENY' },
			hsts: {
				maxAge: 63072000,
				includeSubDomains: true,
			},
			crossOriginEmbedderPolicy: true,
			crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
			crossOriginResourcePolicy: { policy: 'same-origin' },
			expectCt: {
				enforce: true,
			},
			referrerPolicy: {
				policy: 'no-referrer',
			},
			noSniff: true,
			originAgentCluster: true,
			dnsPrefetchControl: {
				allow: true,
			},
			permittedCrossDomainPolicies: {
				permittedPolicies: 'by-content-type',
			},
			xssFilter: true,
		})
	);
	// }
	// CSRF protection
	app.use(
		csurf({
			cookie: {
				httpOnly: environment.COOKIE_ATTRIBUTE_HTTP_ONLY,
				sameSite: environment.COOKIE_ATTRIBUTE_SAME_SITE,
				secure: environment.COOKIE_ATTRIBUTE_SECURE,
			},
			sessionKey: environment.CSRF_SESSION_KEY,
		})
	);

	app.setGlobalPrefix(globalPrefix);

	app.useGlobalPipes(
		new ValidationPipe({
			forbidNonWhitelisted: true,
			stopAtFirstError: true,
			validationError: {
				target: true,
				value: true,
			},
		})
	);

	const port = process.env.PORT || 3333;

	await app.listen(port);

	Logger.log(`🚀 Application is running on: http://localhost:${port}`);

	Logger.log(
		`🧑‍💻 Application is running on: ${environment.ENVIRONMENT_NAME} environment`
	);
}

bootstrap();
