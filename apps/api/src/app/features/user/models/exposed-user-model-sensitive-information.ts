import { IsEnum, IsString,IsNotEmpty } from 'class-validator';

import { ERole } from '@core/enums/role.enum';
import { ObjectId } from 'mongoose';

export class ExposedUserModelSensitiveInformation {

	@IsNotEmpty()
	_id: ObjectId;

	@IsEnum(ERole)
	@IsNotEmpty()
	role: 'admin' | 'user';

	@IsString()
	@IsNotEmpty()
	password: string;
}
