import { IsEnum, IsString } from 'class-validator';

import { ERole } from '@core/enums/role.enum';

export class UserSensitiveInformation {
	@IsString()
	_id: string;

	@IsEnum(ERole)
	role: 'admin' | 'user';

	@IsString()
	password: string;
}
