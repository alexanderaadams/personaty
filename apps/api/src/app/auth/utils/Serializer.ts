import { PassportSerializer } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { UserModel } from '../../users/users.model';
import { AuthService } from '../auth.service';
import { tap } from 'rxjs';

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(private readonly authService: AuthService) {
		super();
	}

	serializeUser(user: UserModel, done: (err: Error, user: UserModel) => void) {
		done(null, user);
	}

	async deserializeUser(
		user: UserModel,
		done: (err: Error, user: UserModel) => void
	) {
		const findUser = await this.authService.findOne({ _id: user.id });

		const data = findUser;

		return data ? done(null, data) : done(null, null);
	}
}
