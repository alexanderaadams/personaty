import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { FormModule } from '../../pages/form/form.module';
import { IonicModule } from '@ionic/angular';
import { ContinueWithModule } from '../../pages/continue-with/continue-with.module';
import { SwitchFormModule } from '../../pages/switch-form/switch-form.module';

const routes: Routes = [
	{
		path: '',
		component: LoginComponent,
	},
];

@NgModule({
	declarations: [LoginComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		ReactiveFormsModule,
		FormModule,
		IonicModule,
		ContinueWithModule,
		SwitchFormModule,
	],
})
export class LoginModule {}
