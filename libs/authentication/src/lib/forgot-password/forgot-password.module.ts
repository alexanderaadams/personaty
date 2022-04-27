import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AngularMaterialModule } from '../shared/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: ForgotPasswordComponent,
	},
];

@NgModule({
	declarations: [ForgotPasswordComponent],

	imports: [
		CommonModule,
		AngularMaterialModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
	],
})
export class ForgotPasswordModule {}
