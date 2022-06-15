import { TestingModule, Test } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';

describe('UserService', () => {
	let userResolver: AuthResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthResolver],
		}).compile();

		userResolver = await module.get<AuthResolver>(AuthResolver);
	});

	it('isAvailable', async () => {
		const isAvailable = jest.spyOn(AuthResolver, 'isAvailable');

		// console.log(createUser);
		// expect(createUser.email).toBeDefined();
	});
});
