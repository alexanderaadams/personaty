import { gql } from 'apollo-angular';

export const SIGNUP = gql`
	mutation ($user: Signup_Input!) {
		signup(user: $user) {
			status
			authenticated
		}
	}
`;

export const SIGNUP_TOKEN = gql`
	mutation ($authToken: String!) {
		signupToken(authToken: $authToken) {
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
			userId
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
