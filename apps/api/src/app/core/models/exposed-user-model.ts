import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class ExposedUserModel {
	@Expose()
	_id: ObjectId;

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
