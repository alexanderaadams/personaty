import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GqlContextType, GqlExceptionFilter } from '@nestjs/graphql';

@Catch()
export class AllHttpExceptionsFilter
	implements ExceptionFilter, GqlExceptionFilter
{
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: any, host: ArgumentsHost): void {
		// In certain situations `httpAdapter` might not be available in the
		// constructor method, thus we should resolve it here.
		const { httpAdapter } = this.httpAdapterHost;

		if (host.getType<GqlContextType>() === 'graphql') {
			throw exception;
		}

		const contextType = host.getType();

		const checkInstanceofHttpException = exception instanceof HttpException;

		const checkInstanceofError = exception instanceof Error;

		const ctx = host.switchToHttp();

		const httpStatus = checkInstanceofHttpException
			? exception?.getStatus()
			: HttpStatus.INTERNAL_SERVER_ERROR;

		const httpMessage = checkInstanceofError
			? exception?.message
			: 'Something went wrong';

		const responseBody = {
			statusCode: httpStatus,
			message: httpMessage,
			path: httpAdapter.getRequestUrl(ctx.getRequest()),
		};

		// eslint-disable-next-line no-constant-condition
		// if (contextType !== 'http' || 'ws' || 'rpc') {
		// 	ctx = GqlArgumentsHost.create(host);
		// }

		// console.log(contextType, exception);

		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
	}
}
