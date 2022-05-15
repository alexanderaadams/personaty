import {
	Controller,
	All,
	HttpException,
	HttpStatus
} from '@nestjs/common';

@Controller('*')
export class UnhandledRoutesController {
	@All()
	async findUser() {
		throw new HttpException(
			{
				statusCode: HttpStatus.NOT_FOUND,
				message: 'The request route does not exist',
				error: 'Not Found',
			},
			HttpStatus.NOT_FOUND
		);
	}
}
