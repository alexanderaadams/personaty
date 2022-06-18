import { HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { InjectedMongooseModelsService } from '@modules/injected-mongoose-models/injected-mongoose-models.service';
import { MyJWTService } from '@modules/my-jwt/my-jwt.service';
import { ImageService } from '@modules/image/image.service';
import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';
import { FileStorageService } from '@core/services/file-storage.service';
import { ExposedUserModel } from '@core/models/exposed-user-model';
import { GoogleOauth2 } from '@features/auth/models/google-oauth-2';

import { UserModel } from './models/user/user.model';
import { ExposedUserModelSensitiveInformation } from './models/exposed-user-model-sensitive-information';
import { ICreateUser } from './interfaces/create-user.interface';
import { User, UserDocument } from './models/user/user.schema';
import { IUpdateUser } from './interfaces/update-user.interface';
import { environment } from '@environment';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
	userModel: Model<UserDocument>;

	constructor(
		private readonly injectedMongooseModelsService: InjectedMongooseModelsService,
		private readonly myJWTService: MyJWTService,
		private readonly imageService: ImageService,
		private readonly fileStorageService: FileStorageService // @InjectModel(User.name, environment.DATABASE_CONNECTION_NAME)
	) // public readonly userModel: Model<UserDocument>
	{
		this.userModel = this.injectedMongooseModelsService.userModel;
	}

	// @TryCatchWrapper()
	async createUser(
		user: ICreateUser | GoogleOauth2
	): Promise<ExposedUserModel> {
		const newUser = (await this.userModel.create(
			user
		)) as unknown as Promise<ExposedUserModel>;

		return newUser;
	}

	@TryCatchWrapper()
	async findUserById(id: string): Promise<UserModel | null> {
		const user = await this.userModel.findById(id).populate('stories').exec();

		if (!user) return null;

		return user as unknown as Promise<UserModel>;
	}

	@TryCatchWrapper()
	async findOne(payload: object): Promise<ExposedUserModel | null> {
		const user = await this.userModel.findOne(payload).exec();

		if (!user) return null;

		return user as unknown as Promise<ExposedUserModel>;
	}

	@TryCatchWrapper()
	async getExposedUserModelSensitiveInformation(
		payload: object
	): Promise<ExposedUserModelSensitiveInformation | null> {
		const user = await this.userModel
			.findOne(payload)
			.select('_id password role')
			.exec();

		if (!user) return null;

		return user as unknown as Promise<ExposedUserModelSensitiveInformation>;
	}

	@TryCatchWrapper()
	async findAllUsers(): Promise<ExposedUserModel> {
		return (await this.userModel
			.find()
			.exec()) as unknown as Promise<ExposedUserModel>;
	}

	async updateUser(updateUser: IUpdateUser): Promise<ExposedUserModel> {
		const { authToken, attrs, profilePicture } = updateUser;

		const { id } = await this.myJWTService.verifyToken(authToken);

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

		const { fullImagePath, imageFileName, image } =
			await this.imageService.checkImageLegitimacy(
				profilePicture,
				id,
				'profile'
			);

		this.fileStorageService.graphqlSaveFileToStorage(image, fullImagePath);

		return user as unknown as Promise<ExposedUserModel>;
	}

	@TryCatchWrapper()
	async deleteUser(
		confirmDeleteUser: boolean,
		authToken: string
	): Promise<null | boolean> {
		if (confirmDeleteUser) {
			const { id } = await this.myJWTService.verifyToken(authToken);
			await this.userModel.findByIdAndDelete(id).exec();

			return null as unknown as Promise<null>;
		}

		return false as unknown as Promise<boolean>;
	}
}
