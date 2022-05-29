import { Module } from '@nestjs/common';

import { UserModule } from '@features/user/users.module';
import { MyJWTModule } from '@modules/jwt/jwt.module';
import { GoogleStrategy } from '@core/utils/passport-strategies/google.strategy';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';

@Module({
	imports: [UserModule, MyJWTModule],
	controllers: [AuthController],
	providers: [AuthService, AuthResolver, GoogleStrategy],
	exports: [AuthService],
})
export class AuthModule {}
