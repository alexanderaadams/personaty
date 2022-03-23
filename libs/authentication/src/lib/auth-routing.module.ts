import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignupComponent } from './signup/signup.component';
import { LogoutComponent } from './logout/logout.component';
import { LoginComponent } from './login/login.component';
import { SuccessComponent } from './success/success.component';

const routes: Routes = [
	{ path: 'signout', component: LogoutComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'logout', component: LogoutComponent },
	{ path: 'forgot-password', component: ForgotPasswordComponent },
	{ path: 'reset-password/:token', component: ResetPasswordComponent },
	{ path: 'success', component: SuccessComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
