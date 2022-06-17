import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfirmNewPasswordComponent } from './confirm-new-password.component';
import { AngularMaterialModule } from '@persona/shared';
import { FormModule } from '../../pages/form/form.module';

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
		AngularMaterialModule,
		FormModule,
	],
})
export class ConfirmNewPasswordModule {}
