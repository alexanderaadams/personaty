import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';

const scrypt = promisify(_scrypt);

@Injectable()
export class HashingService {
	@TryCatchWrapper()
	static async hashingPassword(password: string): Promise<string> {
		// Hash the users password
		// Generate a salt
		const salt: string = randomBytes(32).toString('hex');
		// Hash the salt and the password together
		const hash: Buffer = (await scrypt(password, salt, 32)) as Buffer;
		// Join the hashed result and the salt together
		return salt + '.' + hash.toString('hex');
	}
}
