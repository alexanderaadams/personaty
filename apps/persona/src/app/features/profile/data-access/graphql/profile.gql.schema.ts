import { gql } from 'apollo-angular';

export const GET_USER_INFO = gql`
	query ($id: ID!) {
		getUser(id: $id) {
			fullName

			username

			profilePicture

			createdAt

			bio {
				text
				color
			}

			interests {
				text
				color
			}

			stories {
				_id
				title
				description
				createdAt
				photo
			}
		}
	}
`;

export const UPDATE_PROFILE = gql`
	mutation (
		$user: Update_User_Input!
		$profilePicture: Upload
		$profileCover: Upload
	) {
		updateUser(
			user: $user
			profilePicture: $profilePicture
			profileCover: $profileCover
		) {
			fullName

			username

			profilePicture

			createdAt

			bio {
				text
				color
			}

			interests {
				text
				color
			}
		}
	}
`;
