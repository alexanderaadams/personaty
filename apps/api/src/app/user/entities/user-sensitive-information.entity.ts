import { IsEnum, IsString } from 'class-validator';
import { Role } from '../../core/utilities/models/shared.enum';

export class UserSensitiveInformation {
	@IsString()
	_id: string;

	@IsEnum(Role)
	role: 'admin' | 'user';

	@IsString()
	password: string;
}
