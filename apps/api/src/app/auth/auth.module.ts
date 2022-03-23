import { Module } from '@nestjs/common';
import { UserModule } from '../user/users.module';
import { AuthService } from './auth.service';
import { JWTModule } from '../jwt/jwt.module';
import { GoogleStrategy } from './utils/strategy/google.strategy';
import { NodemailerModule } from './utils/mail/nodemailer.module';
import { AuthResolver } from './auth.resolver';
import { DateScalar } from '../core/date.scalar';
import { AuthController } from './auth.Controller';

@Module({
	imports: [UserModule, JWTModule, NodemailerModule],
	controllers: [AuthController],
	providers: [AuthService, AuthResolver, GoogleStrategy, DateScalar],
	exports: [AuthService],
})
export class AuthModule {}
