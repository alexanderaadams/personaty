import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateStoryComponent } from './create-story/create-story.component';
import { ReadStoryComponent } from './read-story/read-story.component';
import { CoreModule } from '../../../core/core.module';

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

	imports: [CoreModule, RouterModule.forChild(routes)],
})
export class StoryModule {}
