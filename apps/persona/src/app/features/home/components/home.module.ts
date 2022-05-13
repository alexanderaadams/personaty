import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@persona/shared';
import { HomeComponent } from './home.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
	},
];

@NgModule({
	declarations: [HomeComponent],
	imports: [
		CommonModule,
		AngularMaterialModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
	],
})
export class HomeModule {}
