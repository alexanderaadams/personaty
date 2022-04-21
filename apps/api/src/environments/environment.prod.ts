export const environment = {
	production: true,

	ENVIRONMENT_NAME: 'production',

	COOKIE_SECURE: true,

	URI_HOST: 'https://api-persona2.herokuapp.com',
	URI_ORIGIN: 'https://personaty.netlify.app',

	DATABASE_CONNECTION:
		'mongodb+srv://remy:t7mjdezqWKJs6sgT@cluster0.amx9w.mongodb.net/persona',
	DATABASE_NAME: 'persona',

	SECRET_SALT: 'heHYthisIStheBENshapiroSHOW',

	// Google Oauth2 Info
	GOOGLE_CLIENT_ID:
		'248176349194-ji6ciaoe6cdp8jcp0b3601npk7ka1guo.apps.googleusercontent.com',
	GOOGLE_CLIENT_SECRET: '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',
	GOOGLE_CALLBACK_URL: '/api/v1/auth/redirect',

	// Mailtrap Info for Nodemailer
	NODEMAILER_EMAIL_HOST: 'smtp.office365.com',
	NODEMAILER_EMAIL_PORT: 587,
	NODEMAILER_EMAIL_USER: 'persona1335-613@hotmail.com',
	NODEMAILER_EMAIL_PASSWORD: 'agg3sHE3#HRD4?LKdf472b-vxzznmBMRD25ah36',
	NODEMAILER_SECURE_EMAIL_SERVICE: true,
};
