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

		if (host.getType<GqlContextType>() === 'graphql') throw exception;

		const checkInstanceofHttpException = exception instanceof HttpException;

		const checkInstanceofError = exception instanceof Error;

		const ctx = host.switchToHttp();

		const httpStatus = checkInstanceofHttpException
			? exception?.getStatus() ?? exception?.['response'].statusCode
			: HttpStatus.INTERNAL_SERVER_ERROR;

		const httpMessage = checkInstanceofError
			? exception?.message
			: 'Something went wrong';

		const responseBody = {
			statusCode: httpStatus,
			message: httpMessage,
			path: httpAdapter.getRequestUrl(ctx.getRequest()),
		};

		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
	}
}
