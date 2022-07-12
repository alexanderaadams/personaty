import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
	{
		path: '',
		component: NotFoundComponent,
	},
];

@NgModule({
	declarations: [NotFoundComponent],
	imports: [CommonModule, RouterModule.forChild(routes), IonicModule],
})
export class NotFoundModule {}
