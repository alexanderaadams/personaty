import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LogoutComponent } from './logout.component';
import { AngularMaterialModule } from '@persona/shared';

const routes: Routes = [
	{
		path: '',
		component: LogoutComponent,
	},
];

@NgModule({
	declarations: [LogoutComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		AngularMaterialModule,
		ReactiveFormsModule,
	],
})
export class LogoutModule {}
