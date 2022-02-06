import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PRIV_KEY, PUB_KEY } from '@march/keys';
import { JwtStrategy } from '../auth/utils/strategy/jwt.strategy';
import { JWTService } from './jwt.service';


@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: () => ({
				privateKey: PRIV_KEY,
				publicKey: PUB_KEY,

				signOptions: {
					algorithm: 'RS256',
					expiresIn: '1y',
					issuer: 'March Inc.',
					audience: 'www.march.com',
				},
			}),
		}),
	],
	controllers: [],
	providers: [JWTService, JwtStrategy],
	exports: [JWTService],
})
export class JWTModule {}
