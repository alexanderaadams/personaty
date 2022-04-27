import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotAuthGuard } from './shared/not-auth.guard';

const routes: Routes = [
	{
		path: 'signup',
		canActivate: [NotAuthGuard],
		loadChildren: () =>
			import('./signup/signup.module').then((m) => m.SignupModule),
	},
	{
		path: 'login',
		canActivate: [NotAuthGuard],
		loadChildren: () =>
			import('./login/login.module').then((m) => m.LoginModule),
	},
	{
		path: 'logout',
		loadChildren: () =>
			import('./logout/logout.module').then((m) => m.LogoutModule),
	},
	{
		path: 'forgot-password',
		loadChildren: () =>
			import('./forgot-password/forgot-password.module').then(
				(m) => m.ForgotPasswordModule
			),
	},
	{
		path: 'confirm-forgot-password/:token',
		loadChildren: () =>
			import('./confirm-forgot-password/confirm-forgot-password.module').then(
				(m) => m.ConfirmForgotPasswordModule
			),
	},
	{
		path: 'oauth2-success',
		loadChildren: () =>
			import('./oauth2-success/oauth2-success.module').then(
				(m) => m.Oauth2SuccessModule
			),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
