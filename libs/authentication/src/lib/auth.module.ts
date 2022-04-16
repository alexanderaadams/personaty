import { InputComponent } from './shared/input/input.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ConfirmForgotPasswordComponent } from './confirm-forgot-password/confirm-forgot-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MaterialModule } from './shared/material.module';

@NgModule({
	declarations: [
		InputComponent,
		SignupComponent,
		LoginComponent,
		LogoutComponent,
		ConfirmForgotPasswordComponent,
		ForgotPasswordComponent,
	],
	imports: [
		CommonModule,
		MaterialModule,
		AuthRoutingModule,
		ReactiveFormsModule,
		FormsModule,
	],
})
export class AuthModule {
	//
}
