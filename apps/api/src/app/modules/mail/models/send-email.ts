export interface ISendEmail {
	to: string;
	subject: string;
	additionalInfo: {
		bodyText: string;
		expiresDate: string;
		buttonText: string;
		creationConfirmation?: string;
	};
	authTokenURL: string;
}
