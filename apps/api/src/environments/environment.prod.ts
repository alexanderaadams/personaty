export const environment = {
	production: true,

	ENVIRONMENT_NAME: 'production',

	PROJECT_NAME: 'persona',

	//uuidv5
	V5_NAMESPACE_CUSTOM: 'e2d571b9-4338-5548-ab01-a66903c65aad',
	V5_NAME: 'persona',

	//	Cookies attributes
	COOKIE_ATTRIBUTE_SAME_SITE: 'none' as const,
	COOKIE_ATTRIBUTE_SECURE: true,
	COOKIE_ATTRIBUTE_HTTP_ONLY: true,

	//	CORS Configuration
	CORS_METHOD_HEADERS: ['GET', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
	CORS_EXPOSED_HEADERS: ['X-CSRF-Token'],

	// Throttler Configuration
	THROTTLER_DEFAULT_TRYING_RATE_LIMIT: 60,
	THROTTLER_DEFAULT_TIME_TO_LIVE_LIMIT: 60,

	//	URL Connection
	HOST_URL: 'https://api-persona2.herokuapp.com',
	ORIGIN_URL: 'https://personaty.netlify.app',

	//Authentication Validators
	MIN_LENGTH: 8,
	MAX_LENGTH: 30,

	//	MongoDB Atlas Connection Information.
	DATABASE_CONNECTION:
		'mongodb+srv://remy:t7mjdezqWKJs6sgT@cluster0.amx9w.mongodb.net/persona',
	DATABASE_NAME: 'persona',

	//	CSRF Configuration
	CSRF_SESSION_KEY: 'h1e$HY%th61is70-I&St*he(B)E8_Nsh7apir4oSHOW',

	//	Google Oauth2 Info
	GOOGLE_CLIENT_ID:
		'248176349194-ji6ciaoe6cdp8jcp0b3601npk7ka1guo.apps.googleusercontent.com',
	GOOGLE_CLIENT_SECRET: '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',
	GOOGLE_CALLBACK_URL: '/api/v1/auth/redirect',

	//	Outlook Information for Nodemailer
	NODEMAILER_EMAIL_HOST: 'smtp.office365.com',
	NODEMAILER_EMAIL_PORT: 587,
	NODEMAILER_EMAIL_USER: 'persona1335-613@hotmail.com',
	NODEMAILER_EMAIL_PASSWORD: 'agg3sHE3#HRD4?LKdf472b-vxzznmBMRD25ah36',
	NODEMAILER_SECURE_EMAIL_SERVICE: true,
};
