// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,

	ENVIRONMENT_NAME: 'development',

	// Apollo Configuration Options
	APOLLO_SSR_MODE: false,
	APOLLO_ORIGIN: 'same-origin',
	APOLLO_ERROR_POLICY: 'all',

	//	Authentication Validators
	MIN_LENGTH: 2,
	MAX_LENGTH: 8,

	//	Backend URI
	BACKEND_URL: 'http://localhost:3333',
	BACKEND_BASE_URL: 'api/v1',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
