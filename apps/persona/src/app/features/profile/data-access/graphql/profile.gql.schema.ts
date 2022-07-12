import { gql } from 'apollo-angular';

export const GET_USER_INFO = gql`
	query ($id: ID!) {
		getUser(id: $id) {
			id

			fullName

			username

			profilePicture

			createdAt

			locale

			sex

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

export const UPDATE_PROFILE = gql`
	mutation (
		$user: Update_User_Input
		$profilePicture: Upload
		$profileCover: Upload
	) {
		updateUser(
			user: $user
			profilePicture: $profilePicture
			profileCover: $profileCover
		) {
			id

			fullName

			username

			profilePicture

			profileCover

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
