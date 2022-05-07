import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AngularMaterialModule } from '@march/authentication';

import { CreateStoryComponent } from './create-story/create-story.component';
import { ReadStoryComponent } from './read-story/read-story.component';

const routes: Routes = [
	{
		path: '',
		component: CreateStoryComponent,
	},
	{
		path: ':id',
		component: ReadStoryComponent,
	},
];

@NgModule({
	declarations: [ReadStoryComponent, CreateStoryComponent],

	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		AngularMaterialModule,
		FormsModule,
		ReactiveFormsModule,
	],
})
export class StoryModule {}
