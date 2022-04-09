import { IsString } from 'class-validator';
import { User_Status } from '../../core/graphql.schema';

export class UserStatus extends User_Status {
	@IsString()
	status: string;
}
