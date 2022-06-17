import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { FormModule } from '../../pages/form/form.module';
import { LoginMaterialModule } from './utils/login-material.module';

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
		LoginMaterialModule,
	],
})
export class LoginModule {}
