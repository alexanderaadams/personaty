import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Oauth2SuccessComponent } from './oauth2-success.component';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
	{
		path: '',
		component: Oauth2SuccessComponent,
	},
];

@NgModule({
	declarations: [Oauth2SuccessComponent],
	imports: [CommonModule, RouterModule.forChild(routes), IonicModule],
})
export class Oauth2SuccessModule {}
