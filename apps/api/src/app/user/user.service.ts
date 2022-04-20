import {
	BadGatewayException,
	ConflictException,
	HttpException,
	Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { join } from 'path';


import { isFileExtensionSafe, removeFile } from './image-storage';
import { UserInfo } from '../core/shared.model';
import { UserDocument } from './user.schema';
import { UserModel } from './user.model';
import { UserSensitiveInformation } from './entities/user-sensitive-information.entity';
import { readFile } from 'fs';

@Injectable()
export class UserService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<UserDocument>,

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

			return {
				valid: false,
				error: 'File content does not match extension!',
			};
		} catch (err) {
			throw new HttpException('Something Went Wrong', 500);
		}
	}

	async getImage(imageId): Promise<boolean> {
		try {
			const imagesFolderPath = join(process.cwd(), 'upload');

			const fullImagePath = join(imagesFolderPath + '/' + imageId);

			const DoesImageExist = function () {
				return new Promise(function (resolve, reject) {
					readFile(fullImagePath, 'utf8', function (err, data) {
						if (err) reject(err);
						else resolve(data);
					});
				});
			};

			if (await DoesImageExist()) return true;

			throw new HttpException('File Does Not Exist', 404);
		} catch (err) {
			throw new HttpException('Something Went Wrong', 500);
		}
	}
}
