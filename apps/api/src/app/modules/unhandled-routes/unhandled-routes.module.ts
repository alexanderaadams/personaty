import { Module } from '@nestjs/common';

import { UnhandledRoutesController } from './unhandled-routes.controller';

@Module({
	controllers: [UnhandledRoutesController],
})
export class UnhandledRoutesModule {}
