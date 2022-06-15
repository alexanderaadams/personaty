import { Module } from '@nestjs/common';

import { DateScalar } from '@core/utils/graphql-data-scalar/date.scalar';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
	controllers: [UserController],
	providers: [UserService, UserResolver, DateScalar],
	exports: [UserService],
})
export class UserModule {}
