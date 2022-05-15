import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { BehaviorSubject } from 'rxjs';

import { randomColorPicker } from '@core/ui/random-color-generator';
import { Category } from '../../data-access/store/story.model';
import { validImageMimeType } from '@core/models/valid-image-mime-type';
import { UnsubscribeOnDestroyAdapter } from '@persona/shared';

@Component({
	selector: 'persona-create-story',
	templateUrl: './create-story.component.html',
	styleUrls: ['./create-story.component.scss'],
})
export class CreateStoryComponent extends UnsubscribeOnDestroyAdapter {
	readonly separatorKeysCodes: readonly [13, 188] = [ENTER, COMMA] as const;
	addOnBlur = true;
	categories: Category[] = [];
	fileName = '';
	id: string = this.activatedRoute.snapshot.params['id'];
	validStoryMimeType: string = validImageMimeType;
	isStoryMimeTypeValid = new BehaviorSubject(false);

	storyForm: FormGroup = new FormGroup({
		category: new FormControl([''], [Validators.required]),
	});

	constructor(private activatedRoute: ActivatedRoute) {
		super();
	}

	onSubmit() {
		console.log({ ...this.storyForm.value, user_id: this.id });
		if (
			this.storyForm?.invalid ||
			!this.storyForm.value ||
			this.isStoryMimeTypeValid.value
		) {
			return this.storyForm.setErrors({ invalid: true });
		}

		// this.store.dispatch(
		// new CreateStory({ ...this.storyForm.value, user_id: this.id })
		// );
	}

	async add(event: MatChipInputEvent): Promise<void> {
		const value = (event.value ?? '').trim();

		// Add our fruit
		if (value) {
			this.categories.push({
				text: value,
				color: randomColorPicker(),
			});
			this.storyForm.controls['category'].setValue(this.categories);
		}

		// Clear the input value
		event.chipInput?.clear();
	}

	remove(category: Category): void {
		const index = this.categories.indexOf(category);

		if (index >= 0) {
			this.categories.splice(index, 1);
		}
	}

	storyImageSelected(imageInput: any) {
		const storyImage: File = imageInput.files[0];

		// const reader = new FileReader();

		// reader.readAsDataURL(storyImage);

		// console.log(reader.error);

		this.fileName = storyImage.name;

		if (this.validStoryMimeType.includes(storyImage.type))
			this.isStoryMimeTypeValid.next(true);

		console.log(storyImage, imageInput);
	}
}
