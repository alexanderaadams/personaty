import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PRIV_KEY, PUB_KEY } from '@persona/keys';

import { JwtStrategy } from './jwt.strategy';
import { MyJWTService } from './jwt.service';

@Global()
@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: () => ({
				privateKey: PRIV_KEY,
				publicKey: PUB_KEY,

				signOptions: {
					algorithm: 'RS256',
					expiresIn: '1y',
					issuer: 'persona Inc.',
					audience: 'www.persona.com',
				},
			}),
		}),
	],
	controllers: [],
	providers: [MyJWTService, JwtStrategy],
	exports: [MyJWTService],
})
export class MyJWTModule {}
