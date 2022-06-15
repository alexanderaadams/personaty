import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Confirm_Delete_User_Input } from '@core/models/graphql.schema';

export class ConfirmDeleteUser extends Confirm_Delete_User_Input {
	@IsBoolean()
	@IsNotEmpty()
	confirmDeleteUser: boolean;
}
