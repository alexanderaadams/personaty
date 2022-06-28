import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';

import { AngularMaterialModule } from '@persona/shared';

import { ShowProfileComponent } from './show-profile/show-profile.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

const routes: Routes = [
	{
		path: ':userId/update',
		component: UpdateProfileComponent,
	},
	{
		path: ':userId',
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
		ColorPickerModule,
	],
})
export class ProfileModule {}
