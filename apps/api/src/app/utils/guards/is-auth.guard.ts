import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { UserService } from '../../user/user.service';

@Injectable()
export class TokenAuthGuard implements CanActivate {
	constructor(private usersService: UserService) {}

	async canActivate(context: ExecutionContext) {
		try {
			// console.log(context);
			const gqlContext = GqlExecutionContext.create(context);
			// console.log(gqlContext);
			const req = gqlContext.getContext().req;
			// console.log(ctx);
			return await this.usersService.isVerified(req.cookies.token);
		} catch (err) {
			throw new UnauthorizedException('Please Login Again');
		}
	}
}
