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
		let data!: UserModel;
		this.authService.findOne({ _id: user.id }).pipe(
			tap((user) => {
				data = user;
			})
		);
		return data ? done(null, data) : done(null, null);
	}
}
