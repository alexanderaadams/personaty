import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { MyJWTService } from '@modules/jwt/jwt.service';

@Injectable()
export class TokenAuthGuard implements CanActivate {
	constructor(private myJWTService: MyJWTService) {}

	async canActivate(context: ExecutionContext) {
		try {
			// console.log(context);
			const gqlContext = GqlExecutionContext.create(context);
			// console.log(gqlContext);
			const req = gqlContext.getContext().req;
			// console.log(ctx);
			return await this.myJWTService.verifyToken(req.cookies.auth);
		} catch (err) {
			throw new UnauthorizedException(
				'You are not logged in. Please Login Again'
			);
		}
	}
}
