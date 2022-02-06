import fs = require('fs');
export const PRIV_KEY = fs.readFileSync(
	'libs/keys/src/lib/keys/id_rsa_priv.pem',
	'utf8'
);
export const PUB_KEY = fs.readFileSync(
	'libs/keys/src/lib/keys/id_rsa_pub.pem',
	'utf8'
);
