import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { catchError, map, switchMap } from 'rxjs';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private usersService: UsersService) {}

	canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();

		return this.usersService.isVerified(request.cookies.token).pipe(
			switchMap((token: any) =>
				this.usersService
					.findOne({ username: token.username })
					.pipe(map((user) => user?.role === 'admin'))
			),
			catchError((err) => {
				throw new UnauthorizedException('Try To Login');
			})
		);

		// console.log('Sec', request);
	}
}
