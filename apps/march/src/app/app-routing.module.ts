import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
	{
		path: 'profile',
		canLoad: [AuthGuard],
		loadChildren: () =>
			import('./profile/profile.module').then((m) => m.ProfileModule),
	},
	{
		path: 'auth',
		loadChildren: () =>
			import('@march/authentication').then((m) => m.AuthModule),
	},
	{
		path: 'home',
		loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
	},
	{ path: '**', component: NotFoundComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
