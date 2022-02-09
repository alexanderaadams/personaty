import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';

import { UserService } from '../../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private usersService: UserService) {}

	async canActivate(context: ExecutionContext) {
		try {
			const request = context.switchToHttp().getRequest();

			return await this.usersService.isVerified(request.cookies.token);
		} catch (err) {
			throw new UnauthorizedException('Please Login Afain');
		}
	}
}
