import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ColorPickerModule } from 'ngx-color-picker';

import { ShowProfileComponent } from './show-profile/show-profile.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

const routes: Routes = [
	{
		path: ':userId/update',
		component: UpdateProfileComponent,
		title: 'Update Profile',
	},
	{
		path: ':userId',
		component: ShowProfileComponent,
		title: 'Profile',
	},
];
@NgModule({
	declarations: [ShowProfileComponent, UpdateProfileComponent],
	imports: [
		CommonModule,

		IonicModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		ColorPickerModule,
	],
})
export class ProfileModule {}
