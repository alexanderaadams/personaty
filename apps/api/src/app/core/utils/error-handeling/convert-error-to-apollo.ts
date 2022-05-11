import {
	ApolloError,
	AuthenticationError,
	ForbiddenError,
} from 'apollo-server-errors';
import { HttpException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/ban-types
const apolloPredefinedExceptions: Object = {
	401: AuthenticationError,
	403: ForbiddenError,
};

export function convertErrorToApolloError(
	exception: HttpException
): ApolloError {
	let error: ApolloError;

	if (exception.getStatus() in apolloPredefinedExceptions) {
		error = new apolloPredefinedExceptions[exception.getStatus()](
			exception.message
		);
	} else {
		error = new ApolloError(
			exception.message,
			exception.getStatus().toString()
		);
	}

	error.stack = exception.stack;
	error.extensions['response'] = exception.getResponse();
	return error;
}
