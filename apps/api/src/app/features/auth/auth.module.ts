import { Module } from '@nestjs/common';

import { UserModule } from '@features/user/users.module';
import { AuthService } from './auth.service';
import { MyJWTModule } from '@modules/jwt/jwt.module';
import { GoogleStrategy } from './utils/passport-strategies/google.strategy';
import { NodemailerModule } from './utils/mail/nodemailer.module';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';

@Module({
	imports: [UserModule, MyJWTModule, NodemailerModule],
	controllers: [AuthController],
	providers: [AuthService, AuthResolver, GoogleStrategy],
	exports: [AuthService],
})
export class AuthModule {}
