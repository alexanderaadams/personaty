import { UserService } from './user.service';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { environment } from '@environment';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user/user.schema';

jest.mock('createUser');
describe('UserService', () => {
	let userService: UserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				MongooseModule.forFeatureAsync(
					[
						{
							name: User.name,
							useFactory: () => ({ schema: UserSchema }),
						},
					],
					environment.DATABASE_CONNECTION_NAME
				),
			],
			providers: [UserService],
		}).compile();

		userService = await module.get<UserService>(UserService);
	});

	it('createUser', async () => {
		const createUser = jest.spyOn(userService, 'createUser');

		// console.log(createUser);
		// expect(createUser.email).toBeDefined();
	});
});
