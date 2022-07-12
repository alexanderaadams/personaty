import { StoryModel } from '@features/story/models/story/story-model';
import { Expose } from 'class-transformer';
import { User } from './graphql.schema';
import { InterestAndBioAndCategory } from './interest-and-bio-and-category';

export class ExposedUserModel extends User {
	@Expose()
	id: string;

	@Expose()
	username: string;

	@Expose()
	fullName: string;

	@Expose()
	email: string;

	@Expose()
	birthDate: string;

	@Expose()
	createdAt: Date;

	@Expose()
	stories: Array<StoryModel>;

	@Expose()
	sex: 'female' | 'male' | 'other';

	@Expose()
	locale: string;

	@Expose()
	profilePicture: string;

	@Expose()
	profileCover: string;

	@Expose()
	bio: InterestAndBioAndCategory;

	@Expose()
	interests: Array<InterestAndBioAndCategory>;
}
