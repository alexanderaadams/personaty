import { IUpdateProfile } from '../../interfaces/update-profile.interface';

export class GetUser {
	static readonly type = '[Profile] Get User Info';
	constructor(public payload: string) {}
}

export class UpdateProfile {
	static readonly type = '[Profile] Update user profile';
	constructor(public payload: IUpdateProfile | 'profile') {}
}
