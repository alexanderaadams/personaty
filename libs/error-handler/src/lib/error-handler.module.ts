import { Module } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions-filter.controller';

@Module({
	controllers: [AllExceptionsFilter],
	providers: [],
	exports: [AllExceptionsFilter],
})
export class ErrorHandlerModule {}
