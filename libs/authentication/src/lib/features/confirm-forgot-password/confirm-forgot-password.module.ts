import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfirmForgotPasswordComponent } from './confirm-forgot-password.component';
import { AngularMaterialModule } from '@persona/shared';

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
		ReactiveFormsModule,
		AngularMaterialModule,
	],
})
export class ConfirmForgotPasswordModule {}
