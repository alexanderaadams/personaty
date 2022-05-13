export const environment = {
	production: true,

	ENVIRONMENT_TYPE: 'production',

	// Apollo CORS Configuration Options
	ENVIRONMENT_SSR_MODE: true,
	ENVIRONMENT_ORIGIN: 'include',

	//	Authentication Validators
	MIN_LENGTH: 2,
	MAX_LENGTH: 8,

	//	Backend URI
	BACKEND_URL: 'https://api-persona2.herokuapp.com',
	BACKEND_BASE_URL: 'api/v1',
};
