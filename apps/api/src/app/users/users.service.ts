import {
	BadGatewayException,
	ConflictException,
	HttpException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catchError, from, map, Observable, of } from 'rxjs';
import { User, UserDocument, UserModel, FindUser } from './users.model';
import { JWTService } from '../jwt/jwt.service';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private readonly _userModel: Model<UserDocument>,
		private myJWTService: JWTService
	) {}

	createUser(user): Observable<UserModel> {
		return from(this._userModel.create(user)).pipe(
			map((user) => {
				return user;
			}),
			catchError((err) => {
				throw new ConflictException(err);
			})
		) as unknown as Observable<UserModel>;
	}

	findAllUsers(): Observable<UserModel[]> {
		return from(this._userModel.find()).pipe(
			map((users) => {
				if (!users) throw new HttpException('Content Not Found', 203);
				return users;
			}),
			catchError(() => {
				throw new HttpException('Content Not Found', 203);
			})
		) as unknown as Observable<UserModel[]>;
	}

	findUser(id: string): Observable<UserModel> {
		return from(this._userModel.findById(id)).pipe(
			map((user) => {
				if (!user) throw new NotFoundException('User Not Found');

				return user;
			}),
			catchError(() => {
				throw new HttpException('User Not Found', 404);
			})
		) as unknown as Observable<UserModel>;
	}

	findOne(user: FindUser): Observable<UserModel> {
		return from(this._userModel.findOne(user)).pipe(
			map((user) => {
				return user;
			}),
			catchError(() => {
				throw new HttpException('Can Not Be Found', 404);
			})
		) as unknown as Observable<UserModel>;
	}

	updateUser(id: string, attrs): Observable<UserModel> {
		return from(
			this._userModel.findByIdAndUpdate(id, attrs, {
				new: true,
			})
		).pipe(
			catchError((err) => {
				throw new HttpException(
					err.message || 'Something Went Wrong',
					err.status || 500
				);
			})
		) as unknown as Observable<UserModel>;
	}

	deleteUser(id: string): Observable<null> {
		return from(this._userModel.findByIdAndDelete(id)).pipe(
			map(() => {
				return null;
			}),
			catchError(() => {
				throw new HttpException('Something Went Wrong', 500);
			})
		);
	}

	deleteAllUsers(): Observable<null> {
		return from(this._userModel.deleteMany()).pipe(
			map(() => {
				return null;
			}),
			catchError(() => {
				throw new HttpException('Something Went Wrong', 500);
			})
		);
	}

	isVerified(jwt: string) {
		return of(this.myJWTService.verifyToken(jwt)).pipe(
			catchError(() => {
				throw new BadGatewayException('Something Went Wrong');
			})
		);
	}
}
