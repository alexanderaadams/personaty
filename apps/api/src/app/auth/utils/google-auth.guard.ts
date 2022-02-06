import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
	async canActivate(context: ExecutionContext) {
		const activate = (await super.canActivate(context)) as boolean;
		// console.log(activate);
		const request = context.switchToHttp().getRequest();
		// console.log(request);
		await super.logIn(request);

		return activate;
	}
	handleRequest(err, user, info) {
		// You can throw an exception based on either "info" or "err" arguments
		if (err || !user) {
			throw err || new UnauthorizedException();
		}
		return user;
	}
}

// @Injectable()
// export class AuthenticatedGuard implements CanActivate {
// 	async canActivate(context: ExecutionContext): Promise<boolean> {
// 		const req = context.switchToHttp().getRequest();
// 		// console.log(req);
// 		return true;
// 	}
// }

// @Injectable()
// export class GraphQLAuthGuard implements CanActivate {
//   canActivate(context: ExecutionContext) {
//     const ctx = GqlExecutionContext.create(context);
//     return ctx.getContext().req.user;
//   }
// }
