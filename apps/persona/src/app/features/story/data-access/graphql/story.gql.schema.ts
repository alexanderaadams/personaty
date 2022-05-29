import { gql } from 'apollo-angular';

// export const UPLOAD_STORY = gql`
// 	mutation ($picture: Upload!) {
// 		addProfilePicture(picture: $picture)
// 	}
// `;

export const CREATE_STORY = gql`
	mutation ($story: CreateStoryInput!, $storyImage: Upload!) {
		createStory(story: $story, storyImage: $storyImage) {
			_id

			story_image_url

			category {
				text
				color
			}

			created_at

			user_id
		}
	}
`;

export const GET_STORY = gql`
	query ($id: ID!) {
		getStory(id: $id) {
			title
			description
			user_id
			category
		}
	}
`;
