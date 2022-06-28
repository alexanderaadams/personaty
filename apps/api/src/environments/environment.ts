export const environment = {
	production: false,

	ENVIRONMENT_NAME: 'development',

	PROJECT_NAME: 'Persona',

	PROJECT_NAME_Shortcut: 'PSN',

	//uuidv5
	V5_NAMESPACE_CUSTOM: 'e2d571b9-4338-5548-ab01-a66903c65aad',
	V5_NAME: 'persona',

	//	Cookies attributes
	COOKIE_ATTRIBUTE_SAME_SITE: 'strict' as const,
	COOKIE_ATTRIBUTE_SECURE: false,
	COOKIE_ATTRIBUTE_HTTP_ONLY: false,

	//	CORS Configuration
	CORS_METHOD_HEADERS: ['GET', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
	CORS_EXPOSED_HEADERS: ['X-CSRF-Token'],

	// Throttler Configuration
	THROTTLER_DEFAULT_TRYING_RATE_LIMIT: 60,
	THROTTLER_DEFAULT_TIME_TO_LIVE_LIMIT: 60,

	//	URL Connection
	HOST_URL: 'http://localhost:3333',
	ORIGIN_URL: 'http://localhost:4200',

	//	Authentication Validators
	MIN_LENGTH: 2,
	MAX_LENGTH: 8,

	//	MongoDB Atlas Connection Information.
	DATABASE_CONNECTION: 'mongodb://localhost:27017/persona',
	DATABASE_CONNECTION_NAME: 'persona',

	//	CSRF Configuration
	CSRF_SESSION_KEY:
		'h1e$HY%GSthfFHS6JHGfs%@$SHSis70-I&St*he(B)E8_NsYFHSh7apir4#%DStersfg43oSHOW',

	//	Google Oauth2 Info
	GOOGLE_CLIENT_ID:
		'248176349194-bp788eg7k7ji0cjejshfohlufk2ehlfo.apps.googleusercontent.com',
	GOOGLE_CLIENT_SECRET: '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',
	GOOGLE_CALLBACK_URL: '/api/v1/auth/redirect',

	//	Mailtrap Information for Nodemailer
	NODEMAILER_EMAIL_HOST: 'smtp.mailtrap.io',
	NODEMAILER_EMAIL_PORT: 2525,
	NODEMAILER_EMAIL_USER: '92a6a2d9696386',
	NODEMAILER_EMAIL_PASSWORD: '053988b5ba3c61',
	// NODEMAILER_SECURE_EMAIL_SERVICE: false,
};
