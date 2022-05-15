import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catchError, exhaustMap, from, Observable } from 'rxjs';
import { UserModel } from '../user/models/user-db/user-db.model';
import { User } from '../user/models/user-db/user-db.schema';

@Injectable()
export class AdminService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>
	) {}

	findAllUsers(): Observable<UserModel[]> {
		return from(this.userModel.find()).pipe(
			exhaustMap((users) => {
				if (!users) throw new HttpException('Users Not Found', 203);

				return users as unknown as Observable<UserModel[]>;
			}),
			catchError((err) => {
				throw new HttpException(
					err?.message ?? err?.response?.message ?? 'Something Went Wrong',
					err?.status ?? err?.response?.statusCode ?? 500
				);
			})
		);
	}

	deleteAllUsers(): Observable<null> {
		return from(this.userModel.deleteMany()).pipe(
			exhaustMap(() => {
				return null as unknown as Observable<null>;
			}),
			catchError(() => {
				throw new BadRequestException('Something Went Wrong');
			})
		);
	}
}
