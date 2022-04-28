import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularMaterialModule } from '@march/authentication';
import { StoryComponent } from './story.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: StoryComponent,
	},
];

@NgModule({
	declarations: [StoryComponent],

	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		AngularMaterialModule,
		FormsModule,
		ReactiveFormsModule,
	],
})
export class StoryModule {}
