import { Logger, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
// import * as csurf from 'csurf';

import { environment } from './environments/environment.prod';
import { AppModule } from './app/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	let whitelist = [];

	if (environment.production)
		whitelist = ['https://api-persona.netlify.app', '*'];

	if (!environment.production) whitelist = ['http://localhost:4200', '*'];

	const corsOptions = {
		credentials: true, // This is important.

		origin: (origin, callback) => {
			if (whitelist.includes(origin)) return callback(null, true);

			throw new UnauthorizedException('Not allowed by CORS');
		},
	};

	app.enableCors(corsOptions);

	if (environment.production) {
		app.use(helmet());

		// app.use(csurf());
	}

	app.use(cookieParser());

	const globalPrefix = 'api/v1';

	app.setGlobalPrefix(globalPrefix);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		})
	);

	const port = process.env.PORT || 3333;

	await app.listen(port);
	Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
