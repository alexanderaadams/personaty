import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CreateStoryComponent } from './create-story/create-story.component';
import { ShowStoryComponent } from './show-story/show-story.component';
import { AngularMaterialModule } from '@persona/shared';

const routes: Routes = [
	{
		path: 'create',
		component: CreateStoryComponent,
	},
	{
		path: ':id',
		component: ShowStoryComponent,
	},
];

@NgModule({
	declarations: [ShowStoryComponent, CreateStoryComponent],

	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		ReactiveFormsModule,
		AngularMaterialModule,
	],
})
export class StoryModule {}
