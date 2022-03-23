import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AuthState } from '@march/authentication';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
	declarations: [AppComponent, NotFoundComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		ApolloModule,
		AppRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		NgxsModule.forRoot([AuthState]),
		BrowserAnimationsModule,
	],

	providers: [
		CookieService,
		{
			provide: APOLLO_OPTIONS,
			useFactory: (httpLink: HttpLink) => {
				return {
					cache: new InMemoryCache(),
					link: httpLink.create({
						uri: 'http://localhost:3333/graphql',
					}),
				};
			},
			deps: [HttpLink],
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
