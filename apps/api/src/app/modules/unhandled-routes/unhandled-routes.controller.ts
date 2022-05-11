import {
	Controller,
	All,
	HttpException,
	HttpStatus,
	Req,
} from '@nestjs/common';

// import { AllHttpExceptionsFilter } from '@core/utils/error-handeling/all-http-exceptions-filter';

// @UseFilters(AllHttpExceptionsFilter)
@Controller('*')
export class UnhandledRoutesController {
	@All()
	async findUser(@Req() req: Request) {
		throw new HttpException(
			{
				statusCode: HttpStatus.NOT_FOUND,
				message: `The request route does not exist ${req.url}`,
				error: 'Not Found',
			},
			HttpStatus.NOT_FOUND
		);
	}
}
