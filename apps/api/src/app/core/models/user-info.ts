import { Expose } from 'class-transformer';

export class ExposedUserModel {
	@Expose()
	_id: string;

	@Expose()
	username: string;

	@Expose()
	email: string;

	@Expose()
	birthDate: string;

	@Expose()
	createdAt: Date;

	@Expose()
	stories: Array<string>;

	@Expose()
	gender: string;

	@Expose()
	locale: string;

	@Expose()
	profilePicture: string;
}
