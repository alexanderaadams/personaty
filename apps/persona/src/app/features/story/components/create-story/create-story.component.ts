import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { BehaviorSubject } from 'rxjs';
import randomColor from 'randomcolor';

import { ICategory } from '../../data-access/store/story.model';
import { validImageMimeType } from '@core/models/valid-image-mime-type';
import { UnsubscribeOnDestroyAdapter } from '@persona/shared';
import { CreateStory } from '@features/story/data-access/store/story.action';
import { Store } from '@ngxs/store';

@Component({
	selector: 'persona-create-story',
	templateUrl: './create-story.component.html',
	styleUrls: ['./create-story.component.scss'],
})
export class CreateStoryComponent extends UnsubscribeOnDestroyAdapter {
	readonly separatorKeysCodes: readonly [13, 188] = [ENTER, COMMA] as const;
	addOnBlur = true;
	categories: Array<ICategory> = [];
	fileName = '';
	storyImage!: File;
	id: string = this.activatedRoute.snapshot.params['id'];
	validStoryMimeType: string = validImageMimeType;
	isStoryMimeTypeValid = new BehaviorSubject(false);

	storyForm: FormGroup = new FormGroup({
		category: new FormControl([''], [Validators.required]),
		storyImage: new FormControl('', [Validators.required]),
	});

	constructor(
		private activatedRoute: ActivatedRoute,
		private readonly store: Store
	) {
		super();
	}

	async add(event: MatChipInputEvent): Promise<void> {
		const value: string = (event.value ?? '').trim();

		// Add our fruit
		if (value) {
			this.categories.push({
				text: value,
				color: randomColor({
					luminosity: 'light',
					hue: 'random',
				}),
			});
			this.storyForm.controls['category'].setValue(this.categories);
		}

		// Clear the input value
		event.chipInput?.clear();
	}

	remove(category: ICategory): void {
		const index: number = this.categories.indexOf(category);

		if (index >= 0) {
			this.categories.splice(index, 1);
		}
	}

	storyImageSelected(imageInput: any): void {
		this.storyImage = imageInput.files[0];

		// const reader = new FileReader();

		// reader.readAsDataURL(storyImage);

		// console.log(reader.error);

		this.fileName = this.storyImage.name;

		if (this.validStoryMimeType.includes(this.storyImage.type))
			this.isStoryMimeTypeValid.next(true);

		// console.log(this.storyImage, imageInput);
		this.storyForm.controls['storyImage'].setValue(this.storyImage);
	}

	onSubmit(): void {
		if (
			this.storyForm?.invalid ||
			!this.storyForm.value ||
			this.isStoryMimeTypeValid.value
		) {
			this.storyForm.setErrors({ invalid: true });
		}

		this.store.dispatch(new CreateStory({ ...this.storyForm.value }));
	}
}
