import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ResetPasswordComponent } from './reset-password.component';
import { AngularMaterialModule } from '@persona/shared';
import { FormModule } from '../../pages/form/form.module';

const routes: Routes = [
	{
		path: '',
		component: ResetPasswordComponent,
	},
];

@NgModule({
	declarations: [ResetPasswordComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		ReactiveFormsModule,
		AngularMaterialModule,
		FormModule,
	],
})
export class ResetPasswordModule {}
