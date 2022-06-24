import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ShowProfileComponent } from './show-profile/show-profile.component';
import { AngularMaterialModule } from '@persona/shared';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

const routes: Routes = [
	{
		path: ':id/update',
		component: UpdateProfileComponent,
	},
	{
		path: ':id',
		component: ShowProfileComponent,
	},
];
@NgModule({
	declarations: [ShowProfileComponent, UpdateProfileComponent],

	imports: [
		CommonModule,
		AngularMaterialModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
	],
	exports: [],
})
export class ProfileModule {}
