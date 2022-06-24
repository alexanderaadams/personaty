import { gql } from 'apollo-angular';

export const Is_User_Available = gql`
	query ($findUser: Find_User_Input!) {
		isAvailable(findUser: $findUser) {
			available
		}
	}
`;
