import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';
import { AngularMaterialModule } from '../shared/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

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
		AngularMaterialModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
	],
})
export class SignupModule {}
