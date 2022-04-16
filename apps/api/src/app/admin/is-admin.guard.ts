import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { MyJWTService } from '../jwt/jwt.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(
		private myJWTService: MyJWTService,
		private userService: UserService
	) {}

	async canActivate(context: ExecutionContext) {
		try {
			const request = context.switchToHttp().getRequest();

			const token = await this.myJWTService.verifyToken(request.cookies.token);
			const user = await this.userService.getUserSensitiveInformation({
				username: token.username,
			});

			return user?.role === 'admin';
		} catch (err) {
			throw new UnauthorizedException('Try To Login');
		}
	}
}
