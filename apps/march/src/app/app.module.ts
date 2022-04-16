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
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AuthState, MaterialModule } from '@march/authentication';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { AuthGuard } from './core/guards/auth.guard';
import { environment } from '../environments/environment';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { ProfileState } from './profile/store/profile.state';
// import { NotAuthGuard } from './core/guards/not-auth.guard';

@NgModule({
	declarations: [AppComponent, NotFoundComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		ApolloModule,
		AppRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		NgxsModule.forRoot([AuthState, ProfileState], {
			developmentMode: !environment.production,
		}),
		NgxsReduxDevtoolsPluginModule.forRoot(),
		NgxsSelectSnapshotModule.forRoot(),
		NgxsStoragePluginModule.forRoot({
			key: 'auth',
			storage: 0,
		}),
		MaterialModule,
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
