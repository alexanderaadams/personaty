import { Module } from '@nestjs/common';

import { DateScalar } from '@core/utils/graphql-data-scalar/date.scalar';
import { FileStorageService } from '@core/services/file-storage.service';

import { UserService } from './user.service';


@Module({
	imports: [],
	controllers: [],
	providers: [UserService,  DateScalar, FileStorageService],
	exports: [UserService],
})
export class UserModule {}
