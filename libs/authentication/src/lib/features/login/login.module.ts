import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { AngularMaterialModule } from '@persona/shared';
// import { FormComponent } from '../../pages/form/form.component';
import { FormModule } from '../../pages/form/form.module';

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
		AngularMaterialModule,
		FormModule,
	],
})
export class LoginModule {}
