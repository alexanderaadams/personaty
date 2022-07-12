import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LogoutComponent } from './logout.component';
import { FormModule } from '../../pages/form/form.module';
import { IonicModule } from '@ionic/angular';

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
		ReactiveFormsModule,
		FormModule,
		IonicModule,
	],
})
export class LogoutModule {}
