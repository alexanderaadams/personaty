import { Module } from '@nestjs/common';

import { UserModule } from '@features/user/users.module';
import { GoogleStrategy } from '@core/utils/passport-strategies/google.strategy';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';
import { FileStorageService } from '../../core/utils/file-storage.service';

@Module({
	imports: [UserModule],
	controllers: [AuthController],
	providers: [AuthService, AuthResolver, GoogleStrategy, FileStorageService],
	exports: [AuthService],
})
export class AuthModule {}
