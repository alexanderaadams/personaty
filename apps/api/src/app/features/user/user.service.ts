import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserInfo } from '@core/models/user-info';

import { UserDocument, User } from './models/user/user.schema';
import { UserModel } from './models/user/user.model';
import { UserSensitiveInformation } from './models/user-sensitive-information';
import { environment } from '@environment';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name, environment.DATABASE_CONNECTION_NAME)
		public readonly userModel: Model<UserDocument>
	) {}

	async createUser(user: {
		username?: string;
		email: string;
		password: string;
		birthDate?: string;
		email_verified?: boolean;
		_id?: string;
		googleId?: string;
		locale?: string;
		fullName?: string;
		profilePicture?: string;
		accessToken?: string;
		refreshToken?: string;
	}): Promise<UserInfo> {
		return (await this.userModel.create(user)) as unknown as Promise<UserInfo>;
	}

	async findUserById(id: string): Promise<UserModel | null> {
		const user = await this.userModel.findById(id).populate('stories').exec();

		if (!user) return null;

		return user as unknown as Promise<UserModel>;
	}

	async findOne(payload: object): Promise<UserInfo | null> {
		const user = await this.userModel.findOne(payload).exec();

		if (!user) return null;

		return user as unknown as Promise<UserInfo>;
	}

	async getUserSensitiveInformation(
		payload: object
	): Promise<UserSensitiveInformation | null> {
		const user = await this.userModel
			.findOne(payload)
			.select('_id password role')
			.exec();

		if (!user) return null;

		return user as unknown as Promise<UserSensitiveInformation>;
	}

	async findAllUsers(): Promise<UserInfo> {
		return (await this.userModel.find().exec()) as unknown as Promise<UserInfo>;
	}

	async updateUser(id: string, attrs: object): Promise<UserInfo> {
		const user = await this.userModel
			.findByIdAndUpdate(
				id,
				{ ...attrs, updatedAt: Date.now() },
				{
					new: true,
				}
			)
			.exec();

		if (!user) throw new HttpException('Content Not Found', 203);

		return user as unknown as Promise<UserInfo>;
	}

	async deleteUser(id: string): Promise<null> {
		await this.userModel.findByIdAndDelete(id).exec();

		return null as unknown as Promise<null>;
	}
}
