import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ConfirmForgotPasswordComponent } from './confirm-forgot-password/confirm-forgot-password.component';
import { SignupComponent } from './signup/signup.component';
import { LogoutComponent } from './logout/logout.component';
import { LoginComponent } from './login/login.component';
import { NotAuthGuard } from './shared/not-auth.guard';

const routes: Routes = [
	{ path: 'signup', canActivate: [NotAuthGuard], component: SignupComponent },
	{ path: 'login', canActivate: [NotAuthGuard], component: LoginComponent },
	{ path: 'logout', component: LogoutComponent },
	{ path: 'forgot-password', component: ForgotPasswordComponent },
	{
		path: 'confirm-forgot-password/:token',
		component: ConfirmForgotPasswordComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
