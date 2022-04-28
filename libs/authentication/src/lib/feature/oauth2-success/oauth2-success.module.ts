import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Oauth2SuccessComponent } from './oauth2-success.component';
import { AngularMaterialModule } from '../../shared/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: Oauth2SuccessComponent,
	},
];

@NgModule({
	declarations: [Oauth2SuccessComponent],
	imports: [
		CommonModule,
		AngularMaterialModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
	],
})
export class Oauth2SuccessModule {}
