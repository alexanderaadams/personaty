import gql from 'graphql-tag';

export const CREATE_STORY = gql`
	mutation ($story: CreateStoryInput!) {
		createStory(story: $story) {
			title
			description
			user_id
			category
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
