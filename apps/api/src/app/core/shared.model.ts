import { Expose } from 'class-transformer';
import {
	IsDateString,
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
} from 'class-validator';
import { FindUserInput } from './graphql.schema';
import { Gender } from './shared.enum';
// import { FindUserInput } from '../auth/graphql/graphql.ts';

export class FindUser extends FindUserInput {
	@IsString()
	@IsOptional()
	id?: string;

	@IsString()
	@IsOptional()
	username?: string;

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
