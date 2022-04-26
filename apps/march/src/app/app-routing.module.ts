import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
	{
		path: 'profile',
		canActivate: [AuthGuard],
		loadChildren: () =>
			import('./profile/profile.module').then((m) => m.ProfileModule),
	},
	{
		path: 'auth',
		loadChildren: () =>
			import('@march/authentication').then((m) => m.AuthModule),
	},
	{
		path: '',
		canActivate: [AuthGuard],
		loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
	},
	{
		path: 'story/:id',
		canActivate: [AuthGuard],
		loadChildren: () =>
			import('./story/story.module').then((m) => m.StoryModule),
	},
	{ path: '**', component: NotFoundComponent },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			initialNavigation: 'enabledBlocking',
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
