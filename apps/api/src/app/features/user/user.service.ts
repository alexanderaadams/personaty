import {
	BadGatewayException,
	ConflictException,
	HttpException,
	Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserInfo } from '@core/models/user-info';

import { UserDocument } from './models/user-db/user-db.schema';
import { UserModel } from './models/user-db/user-db.model';
import { UserSensitiveInformation } from './models/user-sensitive-information';

@Injectable()
export class UserService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<UserDocument>
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
		try {
			return (await this.userModel.create(
				user
			)) as unknown as Promise<UserInfo>;
		} catch (err) {
			throw new ConflictException(err);
		}
	}

	async findUserById(id: string): Promise<UserModel> {
		try {
			const user = await this.userModel.findById(id).populate('stories').exec();

			if (!user) return null;

			return user as unknown as Promise<UserModel>;
		} catch (err) {
			throw new HttpException('Something Went Wrong', 500);
		}
	}

	async findOne(payload: object): Promise<UserInfo> {
		try {
			const user = await this.userModel.findOne(payload).exec();

			if (!user) return null;

			return user as unknown as Promise<UserInfo>;
		} catch (err) {
			throw new HttpException('Something Went Wrong', 500);
		}
	}

	async getUserSensitiveInformation(
		payload: object
	): Promise<UserSensitiveInformation> {
		try {
			const user = await this.userModel
				.findOne(payload)
				.select('_id password role')
				.exec();

			if (!user) return null;

			return user as unknown as Promise<UserSensitiveInformation>;
		} catch (err) {
			throw new HttpException('Something Went Wrong', 500);
		}
	}

	async findAllUsers(): Promise<UserInfo> {
		try {
			return (await this.userModel
				.find()
				.exec()) as unknown as Promise<UserInfo>;
		} catch (err) {
			throw new HttpException('Something Went Wrong', 500);
		}
	}

	async updateUser(id: string, attrs: object): Promise<UserInfo> {
		try {
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
		} catch (_) {
			throw new BadGatewayException('Something Went Wrong');
		}
	}

	async deleteUser(id: string): Promise<null> {
		try {
			await this.userModel.findByIdAndDelete(id).exec();

			return null as unknown as Promise<null>;
		} catch (_) {
			throw new BadGatewayException('Something Went Wrong');
		}
	}
}
