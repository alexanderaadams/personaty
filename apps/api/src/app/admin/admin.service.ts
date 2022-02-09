import { BadGatewayException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserModel } from '../user/user.model';

@Injectable()
export class AdminService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>
	) {}
	async findAllUsers(): Promise<UserModel[]> {
		try {
			const users = await this.userModel.find();

			if (!users) throw new HttpException('Users Not Found', 203);

			return users as unknown as Promise<UserModel[]>;
		} catch (err) {
			throw new HttpException('Users Not Found', err.status || 203);
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
}
