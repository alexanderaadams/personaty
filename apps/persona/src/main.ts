import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@persona/shared';

if (environment.production) {
	enableProdMode();
}

function bootstrap() {
	platformBrowserDynamic()
		.bootstrapModule(AppModule)
		.catch((err) => console.error(err));
}

if (document.readyState === 'complete') {
	bootstrap();
} else {
	document.addEventListener('DOMContentLoaded', bootstrap);
}
