import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmForgotPasswordComponent } from './confirm-forgot-password.component';
import { RouterModule, Routes } from '@angular/router';
import { AngularMaterialModule } from '../shared/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
	{
		path: '',
		component: ConfirmForgotPasswordComponent,
	},
];

@NgModule({
	declarations: [ConfirmForgotPasswordComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		AngularMaterialModule,
		FormsModule,
		ReactiveFormsModule,
	],
})
export class ConfirmForgotPasswordModule {}
