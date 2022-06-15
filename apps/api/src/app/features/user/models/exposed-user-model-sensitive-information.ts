import { IsEnum, IsString,IsNotEmpty } from 'class-validator';

import { ERole } from '@core/enums/role.enum';

export class ExposedUserModelSensitiveInformation {
	@IsString()
	@IsNotEmpty()
	_id: string;

	@IsEnum(ERole)
	@IsNotEmpty()
	role: 'admin' | 'user';

	@IsString()
	@IsNotEmpty()
	password: string;
}
