import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { MyJWTService } from '@modules/jwt/jwt.service';
import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';

@Injectable()
export class TokenAuthGuard implements CanActivate {
	constructor(private myJWTService: MyJWTService) {}

	@TryCatchWrapper()
	async canActivate(context: ExecutionContext) {
		const gqlContext = GqlExecutionContext.create(context);

		const req = gqlContext.getContext().req;

		return await this.myJWTService.verifyToken(req.cookies.auth);
	}
}
