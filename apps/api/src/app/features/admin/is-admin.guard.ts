import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';

import { MyJWTService } from '@modules/jwt/jwt.service';
import { UserService } from '@features/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(
		private myJWTService: MyJWTService,
		private userService: UserService
	) {}

	async canActivate(context: ExecutionContext) {

			const request = context.switchToHttp().getRequest();

			const authToken = await this.myJWTService.verifyToken(
				request.cookies.authToken
			);
			const user = await this.userService.getUserSensitiveInformation({
				username: authToken.username,
			});

			return user?.role === 'admin';

	}
}
