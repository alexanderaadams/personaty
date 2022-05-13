import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CreateStoryComponent } from './create-story/create-story.component';
import { ReadStoryComponent } from './read-story/read-story.component';
import { AngularMaterialModule } from '@persona/shared';

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
		ReactiveFormsModule,
		AngularMaterialModule,
	],
})
export class StoryModule {}
