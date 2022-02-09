import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.Controller';
import { AuthService } from './auth.service';
import { JWTModule } from '../jwt/jwt.module';
import { GoogleStrategy } from './utils/strategy/google.strategy';
import { NodemailerModule } from './utils/mail/nodemailer.module';

@Module({
	imports: [UsersModule, JWTModule, NodemailerModule],
	controllers: [AuthController],
	providers: [AuthService, GoogleStrategy],
	exports: [AuthService],
})
export class AuthModule {}
