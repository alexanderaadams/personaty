import { gql } from 'apollo-angular';

// export const UPLOAD_STORY = gql`
// 	mutation ($picture: Upload!) {
// 		addProfilePicture(picture: $picture)
// 	}
// `;

export const CREATE_STORY = gql`
	mutation ($story: Create_Story_Input!, $storyImage: Upload!) {
		createStory(story: $story, storyImage: $storyImage) {
			id

			storyImageUrl

			category {
				text
				color
			}

			createdAt

			userId
		}
	}
`;

export const GET_STORY = gql`
	query ($id: ID!) {
		getStory(id: $id) {
			title
			description
			userId
			category
		}
	}
`;
