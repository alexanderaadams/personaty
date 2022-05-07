import { Module } from '@nestjs/common';
import { UserModule } from '../user/users.module';
import { AuthService } from './auth.service';
import { MyJWTModule } from '../jwt/jwt.module';
import { GoogleStrategy } from './utilities/strategy/google.strategy';
import { NodemailerModule } from './utilities/mail/nodemailer.module';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';
import { GqlThrottlerGuard } from '../core/guards/throttler/gql-throttler.guard';
import { APP_GUARD } from '@nestjs/core';
import { environment } from '../../environments/environment';
import { GqlThrottlerBehindProxyGuard } from '../core/guards/throttler/gql-throttler-behind-proxy.guard';

@Module({
	imports: [UserModule, MyJWTModule, NodemailerModule],
	controllers: [AuthController],
	providers: [AuthService, AuthResolver, GoogleStrategy],
	exports: [AuthService],
})
export class AuthModule {}
