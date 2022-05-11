import { IsString } from 'class-validator';

export class Category {
	@IsString() text: string;

	@IsString() color: string;
}
