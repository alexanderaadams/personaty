import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
	async canActivate(context: ExecutionContext) {
		const activate = (await super.canActivate(context)) as boolean;

		const request = context.switchToHttp().getRequest();

		await super.logIn(request);

		return activate;
	}
	handleRequest(err, user, info) {
		// You can throw an exception based on either "info" or "err" arguments
		if (err || !user) {
			throw err ?? new UnauthorizedException();
		}
		return user;
	}
}
