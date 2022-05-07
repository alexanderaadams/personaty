import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AngularMaterialModule } from '@march/authentication';

import { ProfileComponent } from './profile.component';

const routes: Routes = [
	{
		path: '',
		component: ProfileComponent,
	},
];
@NgModule({
	declarations: [ProfileComponent],

	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		AngularMaterialModule,
		ReactiveFormsModule,
		FormsModule,
	],
	exports: [],
})
export class ProfileModule {}
