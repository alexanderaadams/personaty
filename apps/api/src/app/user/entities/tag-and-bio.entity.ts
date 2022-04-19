import { IsString } from "class-validator";

export class TagAndBio {
	@IsString()
	text: string;

	@IsString()
	color: string;
}
