export const environment = {
	production: true,

	ENVIRONMENT_TYPE: 'production',

	// Apollo Configuration Options
	APOLLO_SSR_MODE: false,
	APOLLO_ORIGIN: 'same-origin',
	APOLLO_ERROR_POLICY: 'all',

	//	Authentication Validators
	MIN_LENGTH: 8,
	MAX_LENGTH: 30,

	//	Backend URI
	BACKEND_URL: 'https://api-persona2.herokuapp.com',
	BACKEND_BASE_URL: 'api/v1',
};
