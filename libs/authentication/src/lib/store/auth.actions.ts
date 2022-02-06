export interface AuthStateModel {
	token: string | null;
	username: string | null;
}

export class Signup {
	static readonly type = '[Auth] Signup';
	constructor(
		public payload: { username: string; email: string; password: string }
	) {}
}

export class Login {
	static readonly type = '[Auth] Login';
	constructor(public payload: { username: string; password: string }) {}
}

export class Logout {
	static readonly type = '[Auth] Logout';
}
