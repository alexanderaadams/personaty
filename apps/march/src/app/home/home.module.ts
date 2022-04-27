import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule, AuthModule } from '@march/authentication';
import { RouterModule, Routes } from '@angular/router';

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
		RouterModule.forChild(routes),
		AuthModule,
		AngularMaterialModule,
	],
})
export class HomeModule {}
