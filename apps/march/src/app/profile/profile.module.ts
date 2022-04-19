import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { MaterialModule } from '@march/authentication';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoryComponent } from '../story/story.component';

@NgModule({
	declarations: [ProfileComponent, StoryComponent],
	imports: [
		CommonModule,
		ProfileRoutingModule,
		MaterialModule,
		ReactiveFormsModule,
		FormsModule,
	],
	exports: [],
})
export class ProfileModule {}
