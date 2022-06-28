export interface IExposedUserModelSensitiveInformation {
	id: string;

	role: 'admin' | 'user';

	password: string;
}
