export const environment = {
	production: false,

	ENVIRONMENT_NAME: 'development',

	COOKIE_SECURE: false,

	//URIs
	URI_HOST: 'http://localhost:3333',
	URI_ORIGIN: 'http://localhost:4200',

	// Database Info
	DATABASE_CONNECTION: 'mongodb://localhost:27017/persona',
	// ,
	DATABASE_NAME: 'persona',
	SECRET_SALT: 'heHYthisIStheBENshapiroSHOW',

	// Google Oauth2 Info
	GOOGLE_CLIENT_ID:
		'248176349194-ji6ciaoe6cdp8jcp0b3601npk7ka1guo.apps.googleusercontent.com',
	GOOGLE_CLIENT_SECRET: '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',
	GOOGLE_CALLBACK_URL: '/api/v1/auth/redirect',

	// Mailtrap Info for Nodemailer
	// NODEMAILER_EMAIL_HOST: 'smtp.office365.com',
	// NODEMAILER_EMAIL_PORT: 587,
	// NODEMAILER_EMAIL_USER: 'persona1335-613@hotmail.com',
	// NODEMAILER_EMAIL_PASSWORD: 'agg3sHE3#HRD4?LKdf472b-vxzznmBMRD25ah36',
	// NODEMAILER_SECURE_EMAIL_SERVICE: true,

	NODEMAILER_EMAIL_HOST: 'smtp.mailtrap.io',
	NODEMAILER_EMAIL_PORT: 2525,
	NODEMAILER_EMAIL_USER: '9063ef07a10237',
	NODEMAILER_EMAIL_PASSWORD: '68c620d9e5780b',
	NODEMAILER_SECURE_EMAIL_SERVICE: false,
};
