export class Signup {
	static readonly type = '[Auth] Signup';
	constructor(
		public payload: { email: string; password: string; birthDate: string }
	) {}
}

export class Login {
	static readonly type = '[Auth] Login';
	constructor(public payload: { username: string; password: string }) {}
}

export class LoginWithGoogle {
	static readonly type = '[Auth] Login With Google';
}
export class ForgotPassword {
	static readonly type = '[Auth] Forgot Password';
	constructor(public payload: { email: string }) {}
}
export class ConfirmForgotPassword {
	static readonly type = '[Auth] Confirm Forgot Password';
	constructor(
		public payload: { password: string; confirmPassword: string; token: string }
	) {}
}

export class Logout {
	static readonly type = '[Auth] Logout';
}

export class IsAuthenticated {
	static readonly type = '[Auth] Is Authenticated';
}

export class ResetAuthStoreToDefault {
	static readonly type = '[Auth] Reset Auth Store';
}
