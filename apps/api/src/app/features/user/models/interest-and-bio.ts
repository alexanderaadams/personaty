import { IsString } from 'class-validator';

export class InterestAndBio {
	@IsString()
	text: string;

	@IsString()
	color: string;
}
