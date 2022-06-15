import { IsString, IsNotEmpty } from 'class-validator';
import { Interest_And_Bio_And_Category } from './graphql.schema';

export class InterestAndBioAndCategory extends Interest_And_Bio_And_Category {
	@IsString()
	@IsNotEmpty()
	text: string;

	@IsString()
	@IsNotEmpty()
	color: string;
}
