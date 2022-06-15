import { Module } from '@nestjs/common';

import { DateScalar } from '@core/utils/graphql-data-scalar/date.scalar';
import { FileStorageService } from '@core/services/file-storage.service';
import { UserModule } from '@features/user/users.module';

import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';

@Module({
	imports: [UserModule],
	providers: [StoryResolver, StoryService, DateScalar, FileStorageService],
	exports: [StoryService],
})
export class StoryModule {}
