import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Find_User_Input } from '../../graphql.schema';
import { Gender } from './shared.enum';
// import { FindUserInput } from '../auth/graphql/graphql.ts';

export class FindUser extends Find_User_Input {
	// @IsString()
	// @IsOptional()
	// id?: string;

	// @IsString()
	// @IsOptional()
	// username?: string;

	@IsString()
	@IsOptional()
	email?: string;
}

export class UserInfo {
	@Expose()
	_id: string;

	@Expose()
	username: string;

	@Expose()
	email: string;

	@Expose()
	birthDate: string;

	@Expose()
	createdAt: Date;

	@Expose()
	stories: string[];

	@Expose()
	gender: string;

	@Expose()
	locale: string;

	@Expose()
	profilePicture: string;
}
