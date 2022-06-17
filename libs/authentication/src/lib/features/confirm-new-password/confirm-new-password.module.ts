import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfirmNewPasswordComponent } from './confirm-new-password.component';
import { FormModule } from '../../pages/form/form.module';
import { ConfirmNewPasswordMaterialModule } from './utils/confirm-new-password-material.module';

const routes: Routes = [
	{
		path: '',
		component: ConfirmNewPasswordComponent,
	},
];

@NgModule({
	declarations: [ConfirmNewPasswordComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		ReactiveFormsModule,
		ConfirmNewPasswordMaterialModule,
		FormModule,
	],
})
export class ConfirmNewPasswordModule {}
