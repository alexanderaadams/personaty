import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngxs/store';

import { CreateStory } from '@features/stories/data-access/state/stories.action';
import { IonicChips } from '@core/utils/ionic-chips';
import { ImageService } from '@core/services/image.service';

import { IInterestAndBioAndCategory } from '../../data-access/state/stories.model';

@Component({
	selector: 'persona-create-story',
	templateUrl: './create-story.component.html',
	styleUrls: ['./create-story.component.scss'],
})
export class CreateStoryComponent extends IonicChips<IInterestAndBioAndCategory> {
	id: string = this.activatedRoute.snapshot.params['id'];
	checkedMimeType!: BehaviorSubject<boolean>;

	storyForm: FormGroup = new FormGroup({
		category: new FormControl([''], [Validators.required]),
		storyImage: new FormControl('', [Validators.required]),
	});

	constructor(
		private readonly activatedRoute: ActivatedRoute,
		private readonly store: Store,
		private readonly imageService: ImageService
	) {
		super();
	}

	storyImageSelected(imageInput: any): void {
		// this.checkedMimeType = this.imageService.mimeType(imageInput);

		// const reader = new FileReader();

		// reader.readAsDataURL(storiesImage);

		this.storyForm.controls['storiesImage'].setValue(
			imageInput.files[0] as File
		);
	}

	onSubmit(): void {
		this.storyForm.controls['category'].setValue(this.chips);
		if (
			this.storyForm?.invalid ||
			!this.storyForm.value ||
			this.checkedMimeType.value
		) {
			this.storyForm.setErrors({ invalid: true });
		}

		this.store.dispatch(new CreateStory({ ...this.storyForm.value }));
	}
}
