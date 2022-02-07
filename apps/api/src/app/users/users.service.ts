import {
	BadGatewayException,
	ConflictException,
	HttpException,
	Injectable,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserModel } from './users.model';
import { JWTService } from '../jwt/jwt.service';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private readonly _userModel: Model<UserDocument>,
		private myJWTService: JWTService
	) {}

	async createUser(user): Promise<UserModel> {
		try {
			return (await this._userModel.create(
				user
			)) as unknown as Promise<UserModel>;
		} catch (err) {
			throw new ConflictException(err);
		}
	}

	async findAllUsers(): Promise<UserModel[]> {
		try {
			const users = await this._userModel.find();

			if (!users) throw new HttpException('Users Not Found', 203);

			return users as unknown as Promise<UserModel[]>;
		} catch (err) {
			throw new HttpException('Users Not Found', err.status || 203);
		}
	}

	async findOne(user): Promise<UserModel> {
		try {
			const newUser = await this._userModel.findOne(user);

			if (!newUser) throw new HttpException('User Not Found', 203);

			return newUser as unknown as Promise<UserModel>;
		} catch (err) {
			throw new HttpException('User Not Found', err.status || 203);
		}
	}

	async updateUser(id: string, attrs): Promise<UserModel> {
		try {
			const user = await this._userModel.findByIdAndUpdate(id, attrs, {
				new: true,
			});

			if (!user) throw new HttpException('Content Not Found', 203);

			return user as unknown as Promise<UserModel>;
		} catch (_) {
			throw new BadGatewayException('Something Went Wrong');
		}
	}

	async deleteUser(id: string): Promise<null> {
		try {
			await this._userModel.findByIdAndDelete(id);

			return null as unknown as Promise<null>;
		} catch (_) {
			throw new BadGatewayException('Something Went Wrong');
		}
	}

	async deleteAllUsers(): Promise<null> {
		try {
			await this._userModel.deleteMany();

			return null;
		} catch (_) {
			throw new BadGatewayException('Something Went Wrong');
		}
	}

	async isVerified(jwt: string) {
		try {
			return await this.myJWTService.verifyToken(jwt);
		} catch (_) {
			throw new BadGatewayException('Something Went Wrong');
		}
	}
}
