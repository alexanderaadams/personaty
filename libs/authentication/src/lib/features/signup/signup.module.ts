import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@persona/shared';
import { SignupComponent } from './signup.component';
// import { FormComponent } from '../../pages/form/form.component';
import { FormModule } from '../../pages/form/form.module';

const routes: Routes = [
	{
		path: '',
		component: SignupComponent,
	},
];

@NgModule({
	declarations: [SignupComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		ReactiveFormsModule,
		AngularMaterialModule,
		FormModule,
	],
})
export class SignupModule {}
