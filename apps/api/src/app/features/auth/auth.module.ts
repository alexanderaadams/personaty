import { Module } from '@nestjs/common';

// import { UserModule } from '@features/user/users.module';
import { GoogleStrategy } from '@core/utils/passport-strategies/google.strategy';

import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';
import { FileStorageService } from '@core/services/file-storage.service';
import { UserModule } from '@features/user/users.module';
import { ForgotPasswordService } from './services/forgot-password.service';
import { HashingService } from './services/hashing.service';
import { LoginService } from './services/login.service';
import { SignupService } from './services/signup.service';

@Module({
	imports: [UserModule],
	controllers: [AuthController],
	providers: [
		AuthResolver,
		ForgotPasswordService,
		LoginService,
		HashingService,
		SignupService,
		GoogleStrategy,
		FileStorageService,
	],
	exports: [],
})
export class AuthModule {}
