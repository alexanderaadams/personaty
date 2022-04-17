import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { StoryComponent } from './story/story.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { environment } from '../environments/environment';
import { ProfileState } from './profile/store/profile.state';
import { StoryState } from './story/store/story.state';

import { AuthState, MaterialModule } from '@march/authentication';

@NgModule({
	declarations: [AppComponent, NotFoundComponent, StoryComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		ApolloModule,
		AppRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		NgxsModule.forRoot([AuthState, ProfileState, StoryState], {
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
	exports: [StoryComponent],
})
export class AppModule {}
