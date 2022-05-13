import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@persona/shared';
import { SignupComponent } from './signup.component';

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
	],
})
export class SignupModule {}
