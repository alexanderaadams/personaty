export const environment = {
	production: false,

	ENVIRONMENT_NAME: 'development',

	//	Cookies attributes
	COOKIE_ATTRIBUTE_SAME_SITE: 'strict' as const,
	COOKIE_ATTRIBUTE_SECURE: false,
	COOKIE_ATTRIBUTE_HTTP_ONLY: false,

	//	URL Connection
	HOST_URL: 'http://localhost:3333',
	ORIGIN_URL: 'http://localhost:4200',

	//Authentication Validators
	MIN_LENGTH: 2,
	MAX_LENGTH: 8,

	//MongoDB Atlas Connection Information.
	DATABASE_CONNECTION: 'mongodb://localhost:27017/persona',
	DATABASE_NAME: 'persona',

	/////////////////////
	SECRET_SALT: 'heHYthisIStheBENshapiroSHOW',

	//	Google Oauth2 Info
	GOOGLE_CLIENT_ID:
		'248176349194-bp788eg7k7ji0cjejshfohlufk2ehlfo.apps.googleusercontent.com',
	GOOGLE_CLIENT_SECRET: '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',
	GOOGLE_CALLBACK_URL: '/api/v1/auth/redirect',

	//	Mailtrap Information for Nodemailer
	NODEMAILER_EMAIL_HOST: 'smtp.mailtrap.io',
	NODEMAILER_EMAIL_PORT: 2525,
	NODEMAILER_EMAIL_USER: '9063ef07a10237',
	NODEMAILER_EMAIL_PASSWORD: '68c620d9e5780b',
	NODEMAILER_SECURE_EMAIL_SERVICE: false,
};
