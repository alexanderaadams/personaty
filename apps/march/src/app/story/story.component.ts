import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { Actions, Store } from '@ngxs/store';
import { StoryService } from './story.service';
import { UnsubscribeOnDestroyAdapter } from '@march/authentication';
import { CreateStory } from './store/story.action';

@Component({
	selector: 'march-story',
	templateUrl: './story.component.html',
	styleUrls: ['./story.component.scss'],
})
export class StoryComponent extends UnsubscribeOnDestroyAdapter {
	@Input() storyForm!: FormGroup;
	@Input() id!: string;

	addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	categories: string[] = [];

	constructor(
		private store: Store,
		private activatedRoute: ActivatedRoute,
		private actions$: Actions,
		private storyService: StoryService
	) {
		super();
	}

	add(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();

		// Add our fruit
		if (value) {
			this.categories.push(value);
			this.storyForm.controls['category'].setValue(this.categories);
		}

		// Clear the input value
		event.chipInput?.clear();
	}

	remove(category: string): void {
		const index = this.categories.indexOf(category);

		if (index >= 0) {
			this.categories.splice(index, 1);
		}
	}

	onSubmit() {
		// const id = this.activatedRoute.snapshot.params['id'];
		console.log({ ...this.storyForm.value, user_id: this.id });
		if (this.storyForm?.invalid || !this.storyForm.value) {
			return this.storyForm.setErrors({ invalid: true });
		}

		this.store.dispatch(
			new CreateStory({ ...this.storyForm.value, user_id: this.id })
		);
	}
}
