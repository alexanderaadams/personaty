import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';

import { UserService } from '../user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private usersService: UserService) {}

	async canActivate(context: ExecutionContext) {
		try {
			const request = context.switchToHttp().getRequest();

			const token = await this.usersService.isVerified(request.cookies.token);
			const user = await this.usersService.findOne({
				username: token.username,
			});

			return user?.role === 'admin';
		} catch (err) {
			throw new UnauthorizedException('Try To Login');
		}
	}
}
