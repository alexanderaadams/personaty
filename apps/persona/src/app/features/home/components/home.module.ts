import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { IonicModule } from '@ionic/angular';

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
		IonicModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
	],
})
export class HomeModule {}
