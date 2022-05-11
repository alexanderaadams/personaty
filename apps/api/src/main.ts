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
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	const whitelist = [environment.HOST_URL, environment.ORIGIN_URL, undefined];
	const globalPrefix = 'api/v1';

	const corsOptions = {
		origin: function (origin, callback) {
			if (whitelist.indexOf(origin) !== -1) return callback(null, true);

			throw new UnauthorizedException('Not allowed by CORS');
		},
		methods: environment.CORS_HEADERS,
		credentials: true,
	};

	app.enableCors(corsOptions);

	app.use(
		'/graphql',
		graphqlUploadExpress({
			maxFileSize: 10000,
			maxFiles: 1,
		})
	);
	app.use(cookieParser());
	app.use(mongoSanitize());
	app.use(hpp());
	app.use(compression());
	app.use(
		csurf({
			cookie: {
				httpOnly: environment.COOKIE_ATTRIBUTE_HTTP_ONLY,
				sameSite: environment.COOKIE_ATTRIBUTE_SAME_SITE,
				secure: environment.COOKIE_ATTRIBUTE_SECURE,
				path: '/',
			},
			sessionKey: environment.CSRF_SESSION_KEY,
		})
	);

	app.use(
		helmet({
			frameguard: { action: 'DENY' },
			hsts: {
				maxAge: 63072000,
				includeSubDomains: true,
			},
			noSniff: true,
			crossOriginEmbedderPolicy: true,
			crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
			crossOriginResourcePolicy: { policy: 'same-origin' },
		})
	);
	if (environment.production) {
		app.set('trust proxy', 1);
	}

	app.setGlobalPrefix(globalPrefix);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		})
	);

	const port = process.env.PORT || 3333;

	await app.listen(port);

	Logger.log(`🚀 Application is running on: http://localhost:${port}`);

	Logger.log(
		`🧑‍💻 Application is running on: ${environment.ENVIRONMENT_NAME} environment`
	);

	// console.log(whitelist);
}

bootstrap();
