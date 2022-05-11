import { IsOptional, IsString } from 'class-validator';

import { Find_User_Input } from './graphql.schema';

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
