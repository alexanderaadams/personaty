import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthModule } from '@persona/authentication';
import { CoreModule } from '../../../core/core.module';
import { HomeComponent } from './home.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
	},
];

@NgModule({
	declarations: [HomeComponent],

	imports: [CoreModule, RouterModule.forChild(routes), AuthModule],
})
export class HomeModule {}
