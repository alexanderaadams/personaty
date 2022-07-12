import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfirmNewPasswordComponent } from './confirm-new-password.component';
import { FormModule } from '../../pages/form/form.module';
import { IonicModule } from '@ionic/angular';
import { SwitchFormModule } from '../../pages/switch-form/switch-form.module';

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
		SwitchFormModule,
		FormModule,
		IonicModule,
	],
})
export class ConfirmNewPasswordModule {}
