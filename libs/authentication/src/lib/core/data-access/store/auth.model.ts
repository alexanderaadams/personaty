export interface IAuthStateModel {
	status: string | null;
	authenticated: boolean | null | unknown;
}

export interface IUserAvailableResponse {
	available: boolean;
}

export interface IUserAvailableRequest {
	username?: string;
	email?: string;
}

export interface ISignupCredentials {
	email: string;
	password: string;
	birthDate: string;
}

export interface ILoginCredentials {
	username: string;
	password: string;
}

export interface IConfirmForgotPasswordCredentials {
	password: string;
	confirmPassword: string;
	authToken: string;
}
