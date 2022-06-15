import { User } from '@core/models/graphql.schema';
import { environment } from '@environment';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

let app: INestApplication;
let userData: User;

describe('AppController',()=>{

	const module = await Test.createTestingModule({
		controllers: [AppController],
		imports: [
			MongooseModule.forRootAsync({
				connectionName: environment.DATABASE_CONNECTION_NAME,
				useFactory: () => ({
					uri: environment.DATABASE_CONNECTION,
					retryAttempts: 5,
					retryDelay: 1000,
					autoIndex: environment.production,
				}),
			}),
		],
	}).compile();
	app = module.createNestApplication();
	app.useGlobalPipes(new ValidationPipe());
	await app.init();
});
