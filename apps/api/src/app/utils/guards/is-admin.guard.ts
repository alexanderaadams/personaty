import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { catchError, map, of, switchMap } from 'rxjs';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private usersService: UsersService) {}

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
