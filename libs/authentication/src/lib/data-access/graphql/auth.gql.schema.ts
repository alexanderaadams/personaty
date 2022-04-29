import gql from 'graphql-tag';

export const IS_AVAILABLE = gql`
	query ($findUser: Find_User_Input!) {
		isAvailable(findUser: $findUser) {
			available
		}
	}
`;

export const SIGNUP = gql`
	mutation ($user: Signup_Input!) {
		signup(user: $user) {
			status
			authenticated
		}
	}
`;

export const SIGNUP_TOKEN = gql`
	mutation ($token: String!) {
		signupToken(token: $token) {
			status
			authenticated
		}
	}
`;

export const LOGIN = gql`
	mutation ($user: Login_Input!) {
		login(user: $user) {
			status
			authenticated
		}
	}
`;

export const SEND_FORGOT_PASSWORD_EMAIL = gql`
	mutation ($user: Send_Forgot_Password_Email_Input!) {
		sendForgotPasswordEmail(user: $user) {
			status
			authenticated
		}
	}
`;

export const CONFIRM_FORGOT_PASSWORD = gql`
	mutation ($credentials: Confirm_Forgot_Password_Input!) {
		confirmForgotPassword(credentials: $credentials) {
			status
			authenticated
		}
	}
`;
export const LOGOUT = gql`
	query {
		logout {
			status
			authenticated
		}
	}
`;

export const IS_AUTHENTICATED = gql`
	query {
		isAuthenticated {
			status
			authenticated
		}
	}
`;
