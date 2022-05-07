import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
	{
		path: 'profile/:id',
		canActivate: [AuthGuard],
		loadChildren: () =>
			import('./profile/components/profile.module').then(
				(m) => m.ProfileModule
			),
	},
	{
		path: 'auth',
		loadChildren: () =>
			import('@march/authentication').then((m) => m.AuthModule),
	},
	{
		path: '',
		canActivate: [AuthGuard],
		loadChildren: () =>
			import('./home/components/home.module').then((m) => m.HomeModule),
	},
	{
		path: 'story',
		// canActivate: [AuthGuard],
		loadChildren: () =>
			import('./story/components/story.module').then((m) => m.StoryModule),
	},
	{
		path: '**',
		loadChildren: () =>
			import('./not-found/components/not-found.module').then(
				(m) => m.NotFoundModule
			),
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			onSameUrlNavigation: 'ignore',
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
