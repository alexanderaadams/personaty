import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from './shared/shared.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { SignoutComponent } from './logout/logout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SuccessComponent } from './success/success.component';

@NgModule({
	declarations: [
		SignupComponent,
		LoginComponent,
		SignoutComponent,
		ResetPasswordComponent,
		ForgotPasswordComponent,
		SuccessComponent,
	],
	imports: [
		CommonModule,
		AuthRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		SharedModule,
	],
})
export class AuthModule {}
