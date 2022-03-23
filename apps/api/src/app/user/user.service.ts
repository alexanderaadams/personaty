import {
	BadGatewayException,
	ConflictException,
	HttpException,
	Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { join } from 'path';

import { User, UserExtraInfo, UserModel } from './user.model';
import { JWTService } from '../jwt/jwt.service';
import { isFileExtensionSafe, removeFile } from './image-storage';
import { UserInfo } from '../core/shared.model';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>,
		private myJWTService: JWTService
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
			const user = await this.userModel.findById(id);

			if (!user) return null;

			return user as unknown as Promise<UserModel>;
		} catch (err) {
			throw new HttpException(
				err?.message || err?.response?.message || 'Something Went Wrong',
				err?.status || err?.response?.statusCode || 500
			);
		}
	}

	async findOne(payload: object): Promise<UserInfo> {
		try {
			const user = await this.userModel.findOne(payload);

			if (!user) return null;

			return user as unknown as Promise<UserInfo>;
		} catch (err) {
			throw new HttpException(
				err?.message || err?.response?.message || 'Something Went Wrong',
				err?.status || err?.response?.statusCode || 500
			);
		}
	}

	async getUserExtraInfo(payload: object): Promise<UserExtraInfo> {
		try {
			const user = await this.userModel
				.findOne(payload)
				.select('_id password role');

			if (!user) return null;

			return user as unknown as Promise<UserExtraInfo>;
		} catch (err) {
			throw new HttpException(
				err?.message || err?.response?.message || 'Something Went Wrong',
				err?.status || err?.response?.statusCode || 500
			);
		}
	}

	async findAllUsers(): Promise<UserInfo> {
		try {
			return (await this.userModel.find()) as unknown as Promise<UserInfo>;
		} catch (err) {
			throw new HttpException(
				err?.message || err?.response?.message || 'Something Went Wrong',
				err?.status || err?.response?.statusCode || 500
			);
		}
	}

	async updateUser(id: string, attrs: object): Promise<UserInfo> {
		try {
			const user = await this.userModel.findByIdAndUpdate(
				id,
				{ ...attrs, updatedAt: Date.now() },
				{
					new: true,
				}
			);

			if (!user) throw new HttpException('Content Not Found', 203);

			return user as unknown as Promise<UserInfo>;
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

	async isVerified(jwt: string) {
		try {
			return await this.myJWTService.verifyToken(jwt);
		} catch (_) {
			throw new BadGatewayException('Something Went Wrong');
		}
	}

	async uploadImage(file: Express.Multer.File, id: string) {
		try {
			const user = await this.findUserById(id);

			const fileName = file?.filename;

			if (!fileName)
				return { valid: false, error: 'File must be a png, jpg/jpeg' };

			const imagesFolderPath = join(process.cwd(), 'upload');

			const fullImagePath = join(imagesFolderPath + '/' + file.filename);

			const isFileLegit = await isFileExtensionSafe(fullImagePath);

			if (isFileLegit)
				return this.updateUser(user._id, {
					profilePicture: fileName,
				});

			removeFile(fullImagePath);

			return { valid: false, error: 'File content does not match extension!' };
		} catch (err) {
			throw new HttpException(
				err?.message || err?.response?.message || 'Something Went Wrong',
				err?.status || err?.response?.statusCode || 500
			);
		}
	}
}
