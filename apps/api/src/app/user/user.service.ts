import {
	BadGatewayException,
	ConflictException,
	HttpException,
	Injectable,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserModel } from './user.model';
import { JWTService } from '../jwt/jwt.service';
import { FindUser } from '../core/shared.model';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
		private myJWTService: JWTService
	) {}

	async createUser(user): Promise<UserModel> {
		try {
			return (await this.userModel.create(
				user
			)) as unknown as Promise<UserModel>;
		} catch (err) {
			throw new ConflictException(err);
		}
	}

	async findAllUsers(): Promise<UserModel[]> {
		try {
			const users = await this.userModel.find();

			if (!users) throw new HttpException('Users Not Found', 203);

			return users as unknown as Promise<UserModel[]>;
		} catch (err) {
			throw new HttpException('Users Not Found', err.status || 203);
		}
	}

	async findOne(user: FindUser): Promise<UserModel> {
		try {
			const newUser = await this.userModel.findOne(user);

			if (!newUser) return null;

			return newUser as unknown as Promise<UserModel>;
		} catch (err) {
			throw new HttpException('User Not Found', err.status || 203);
		}
	}

	async updateUser(id: string, attrs: object): Promise<UserModel> {
		try {
			const user = await this.userModel.findByIdAndUpdate(
				id,
				{ ...attrs, updatedAt: Date.now() },
				{
					new: true,
				}
			);

			if (!user) throw new HttpException('Content Not Found', 203);

			return user as unknown as Promise<UserModel>;
		} catch (_) {
			throw new BadGatewayException('Something Went Wrong');
		}
	}

	async deleteUser(id: string): Promise<null> {
		try {
			await this.userModel.findByIdAndDelete(id);

			return null as unknown as Promise<null>;
		} catch (_) {
			throw new BadGatewayException('Something Went Wrong');
		}
	}

	async deleteAllUsers(): Promise<null> {
		try {
			await this.userModel.deleteMany();

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
