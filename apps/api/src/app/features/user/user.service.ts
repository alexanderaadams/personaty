import { BehaviorSubject } from 'rxjs';
import { HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { InjectedMongooseModelsService } from '@modules/injected-mongoose-models/injected-mongoose-models.service';
import { MyJWTService } from '@modules/my-jwt/my-jwt.service';
import { ImageService } from '@modules/image/image.service';
import { TryCatchWrapper } from '@core/utils/error-handling/try-catch-wrapper';
import { FileStorageService } from '@core/services/file-storage.service';
import { ExposedUserModel } from '@core/models/exposed-user-model';
import { GoogleOauth2 } from '@features/auth/models/google-oauth-2';
import { IImage } from '@modules/image/utils/interfaces/image.interface';

import { ICreateUser } from './interfaces/create-user.interface';
import { UserDocument } from './models/user/user.schema';
import { IUpdateUser } from './interfaces/update-user.interface';
import { IExposedUserModelSensitiveInformation } from './interfaces/exposed-user-model-sensitive-information.interface';

@Injectable()
export class UserService {
	userModel: Model<UserDocument>;

	constructor(
		private readonly injectedMongooseModelsService: InjectedMongooseModelsService,
		private readonly myJWTService: MyJWTService,
		private readonly imageService: ImageService,
		private readonly fileStorageService: FileStorageService
	) {
		this.userModel = this.injectedMongooseModelsService.userModel;
	}

	@TryCatchWrapper()
	async createUser(
		user: ICreateUser | GoogleOauth2
	): Promise<ExposedUserModel> {
		const newUser = (await this.userModel.create(
			user
		)) as unknown as Promise<ExposedUserModel>;

		return newUser;
	}

	@TryCatchWrapper()
	async findUserById(id: string): Promise<ExposedUserModel | null> {
		const user = await this.userModel.findById(id).exec();

		if (!user) return null;

		return user as unknown as Promise<ExposedUserModel>;
	}

	@TryCatchWrapper()
	async findOne(payload: object): Promise<ExposedUserModel | null> {
		const user = await this.userModel.findOne(payload).exec();

		if (!user) return null;

		return user as unknown as Promise<ExposedUserModel>;
	}

	@TryCatchWrapper()
	async getIExposedUserModelSensitiveInformation(
		payload: object
	): Promise<IExposedUserModelSensitiveInformation | null> {
		const user = await this.userModel
			.findOne(payload)
			.select('id password role')
			.exec();

		if (!user) return null;

		return user as unknown as Promise<IExposedUserModelSensitiveInformation>;
	}

	@TryCatchWrapper()
	async findAllUsers(): Promise<ExposedUserModel> {
		return (await this.userModel
			.find()
			.exec()) as unknown as Promise<ExposedUserModel>;
	}

	async updateUser(updateUser: IUpdateUser): Promise<ExposedUserModel> {
		const { authToken, attrs, profilePicture, profileCover } = updateUser;

		const { id } = await this.myJWTService.verifyToken(authToken);

		const checkedProfilePictureLegitimacy = new BehaviorSubject<IImage | null>(
			null
		);

		const checkedProfileCoverLegitimacy = new BehaviorSubject<IImage | null>(
			null
		);

		const user = (await this.userModel.findById(
			id
		)) as unknown as ExposedUserModel;

		if (!user) throw new HttpException('Content Not Found', 203);

		if (profilePicture) {
			checkedProfilePictureLegitimacy.next(
				await this.imageService.checkImageLegitimacy(
					profilePicture,
					id,
					'profile'
				)
			);

			Promise.all([
				this.fileStorageService.removeFile(user.id, user.profilePicture),
				this.fileStorageService.graphqlSaveFileToStorage(
					checkedProfilePictureLegitimacy.value?.image,
					checkedProfilePictureLegitimacy.value?.fullImagePath ?? ''
				),
			]);
		}

		if (profileCover) {
			checkedProfileCoverLegitimacy.next(
				await this.imageService.checkImageLegitimacy(
					profileCover,
					id,
					'profile'
				)
			);

			Promise.all([
				this.fileStorageService.removeFile(user.id, user.profileCover),
				this.fileStorageService.graphqlSaveFileToStorage(
					checkedProfileCoverLegitimacy.value?.image,
					checkedProfileCoverLegitimacy.value?.fullImagePath ?? ''
				),
			]);
		}

		return this.userModel
			.findByIdAndUpdate(
				id,
				{
					...attrs,
					updatedAt: Date.now(),
					profilePicture: checkedProfilePictureLegitimacy.value?.imageFileName,
					profileCover: checkedProfileCoverLegitimacy.value?.imageFileName,
				},
				{
					new: true,
				}
			)
			.exec() as unknown as Promise<ExposedUserModel>;
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
