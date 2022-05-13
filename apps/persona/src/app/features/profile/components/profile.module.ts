import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProfileComponent } from './profile.component';
import { AngularMaterialModule } from '@persona/shared';

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
		AngularMaterialModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
	],
	exports: [],
})
export class ProfileModule {}
