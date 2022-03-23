import gql from 'graphql-tag';

export const IS_AVAILABLE = gql`
	query ($findUser: FindUserInput!) {
		isAvailable(findUser: $findUser) {
			available
		}
	}
`;

export const SIGNUP = gql`
	mutation ($user: SignupInput!) {
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
	mutation ($user: LoginInput!) {
		login(user: $user) {
			status
			authenticated
		}
	}
`;

export const FORGOT_PASSWORD = gql`
	mutation ($user: ForgotPasswordInput!) {
		forgotPassword(user: $user) {
			status
			authenticated
		}
	}
`;

export const RESET_PASSWORD = gql`
	mutation ($credentials: ResetPasswordTokenInput!) {
		resetPasswordToken(credentials: $credentials) {
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
