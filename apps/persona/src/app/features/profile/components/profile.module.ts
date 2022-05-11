import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '../../../core/core.module';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
	{
		path: '',
		component: ProfileComponent,
	},
];
@NgModule({
	declarations: [ProfileComponent],

	imports: [CoreModule, RouterModule.forChild(routes)],
	exports: [],
})
export class ProfileModule {}
